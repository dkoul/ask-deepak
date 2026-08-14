export type RecaptchaVersion = 'v2' | 'v3';

export interface RecaptchaConfig {
  enabled: boolean;
  siteKey: string;
  version: RecaptchaVersion;
}

export interface Grecaptcha {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
  render: (
    container: HTMLElement,
    parameters: {
      sitekey: string;
      theme?: 'dark' | 'light';
      size?: 'compact' | 'normal';
    }
  ) => number;
  getResponse: (widgetId?: number) => string;
  reset: (widgetId?: number) => void;
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}
