import type { Section } from '../lib/sections';

const TABS: { id: Section; label: string; icon: typeof ListIcon }[] = [
  { id: 'home', label: 'Home', icon: ListIcon },
  { id: 'experience', label: 'Work', icon: BuildingIcon },
  { id: 'achievements', label: 'Notes', icon: PinIcon },
  { id: 'chat', label: 'Ask', icon: PlusIcon },
];

export function BottomTabs({
  active,
  onSelect,
}: {
  active: Section;
  onSelect: (section: Section) => void;
}) {
  return (
    <nav className="bottom-tabs">
      <div className="bottom-tabs-inner">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`bottom-tab${active === t.id ? ' active' : ''}`}
            onClick={() => onSelect(t.id)}
          >
            <t.icon />
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 5h.01M3 12h.01M3 19h.01M8 5h13M8 12h13M8 19h13" />
    </svg>
  );
}
function BuildingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M6 12h12M10 6h.01M14 6h.01M10 10h.01M14 10h.01M10 16h.01M14 16h.01" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  );
}
