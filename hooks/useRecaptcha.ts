import { useCallback, useEffect, useRef, useState } from 'react';
import type { RecaptchaConfig } from '../lib/recaptcha';

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
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
        const response = await fetch('/api/config');
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
            : 'https://www.google.com/recaptcha/api.js';

        await loadScript(scriptSrc);

        if (cancelled) return;

        window.grecaptcha?.ready(() => {
          if (!cancelled) setScriptReady(true);
        });
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
      if (
        !node ||
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
        theme: 'dark',
        size: 'compact',
      });
      setWidgetReady(true);
    },
    [config, scriptReady]
  );

  const isReady =
    scriptReady &&
    (!config?.enabled || config.version === 'v3' || widgetReady);

  const getToken = useCallback(async (): Promise<string | null> => {
    if (!config?.enabled || !window.grecaptcha) {
      return null;
    }

    if (config.version === 'v3') {
      return window.grecaptcha.execute(config.siteKey, { action: 'chat' });
    }

    const token = window.grecaptcha.getResponse(widgetIdRef.current ?? undefined);
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
