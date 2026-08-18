export function SupportBanner({ onAsk }: { onAsk: () => void }) {
  const hide = () => {
    localStorage.setItem('supportBannerHidden', '1');
    document.documentElement.setAttribute('data-support-banner', 'hidden');
  };
  return (
    <div className="support-banner" role="complementary" aria-label="Hiring and speaking">
      <span className="support-banner-text">
        Open to hiring conversations, mentorship, and speaking invites.{' '}
        <button type="button" className="support-banner-link" onClick={onAsk}>
          Ask Bubbly →
        </button>
      </span>
      <button type="button" className="support-banner-close" aria-label="Dismiss support bar" onClick={hide}>
        ×
      </button>
    </div>
  );
}
