import { app } from './app';
import { env } from './env';
import { isRecaptchaEnabled } from './recaptcha';

const PORT = Number(env('PORT') || 3000);

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(
      `DeepSeek API: ${env('DEEPSEEK_API_KEY') ? 'configured' : 'NOT configured (set DEEPSEEK_API_KEY)'}`
    );
    console.log(
      `reCAPTCHA: ${isRecaptchaEnabled() ? 'enabled' : 'NOT configured (set RECAPTCHA_SITE_KEY + RECAPTCHA_SECRET_KEY)'}`
    );
  });
}

export default app;
