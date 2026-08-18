import { useCallback, useEffect, useRef, useState } from 'react';
import type { RecaptchaConfig } from '../lib/recaptcha';

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      if (window.grecaptcha) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load reCAPTCHA')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
    document.head.appendChild(script);
  });
}

function waitForGrecaptcha(timeoutMs = 10000): Promise<NonNullable<typeof window.grecaptcha>> {
  return new Promise((resolve, reject) => {
    const started = Date.now();

    const tryReady = () => {
      if (window.grecaptcha?.ready) {
        window.grecaptcha.ready(() => {
          if (window.grecaptcha) resolve(window.grecaptcha);
          else reject(new Error('reCAPTCHA missing after ready'));
        });
        return;
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error('Timed out waiting for reCAPTCHA'));
        return;
      }
      window.setTimeout(tryReady, 50);
    };

    tryReady();
  });
}

export function useRecaptcha() {
  const [config, setConfig] = useState<RecaptchaConfig | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const response = await fetch('/api/config', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Config request failed (${response.status})`);
        }
        const data = await response.json();
        const recaptcha = data.recaptcha as RecaptchaConfig;

        if (!recaptcha?.enabled || !recaptcha.siteKey) {
          if (!cancelled) {
            setConfig({ enabled: false, siteKey: '', version: 'v2' });
            setScriptReady(true);
          }
          return;
        }

        if (cancelled) return;
        setConfig(recaptcha);

        const scriptSrc =
          recaptcha.version === 'v3'
            ? `https://www.google.com/recaptcha/api.js?render=${recaptcha.siteKey}`
            : 'https://www.google.com/recaptcha/api.js?render=explicit';

        await loadScript(scriptSrc);
        await waitForGrecaptcha();

        if (!cancelled) setScriptReady(true);
      } catch {
        if (!cancelled) {
          setLoadError('Captcha failed to load');
          setScriptReady(true);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  const containerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) {
        widgetIdRef.current = null;
        setWidgetReady(false);
        return;
      }

      if (
        !config?.enabled ||
        config.version !== 'v2' ||
        !scriptReady ||
        !window.grecaptcha ||
        widgetIdRef.current !== null
      ) {
        return;
      }

      widgetIdRef.current = window.grecaptcha.render(node, {
        sitekey: config.siteKey,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        size: 'normal',
      });
      setWidgetReady(true);
    },
    [config, scriptReady]
  );

  const isReady =
    scriptReady &&
    (!config?.enabled || config.version === 'v3' || widgetReady);

  const getToken = useCallback(async (): Promise<string | null> => {
    if (!config?.enabled) {
      return null;
    }

    const grecaptcha = await waitForGrecaptcha();

    if (config.version === 'v3') {
      return grecaptcha.execute(config.siteKey, { action: 'chat' });
    }

    const token = grecaptcha.getResponse(widgetIdRef.current ?? undefined);
    return token || null;
  }, [config]);

  const reset = useCallback(() => {
    if (config?.enabled && config.version === 'v2' && window.grecaptcha) {
      window.grecaptcha.reset(widgetIdRef.current ?? undefined);
    }
  }, [config]);

  return {
    config,
    isReady,
    loadError,
    containerRef,
    getToken,
    reset,
    isRequired: Boolean(config?.enabled),
  };
}
