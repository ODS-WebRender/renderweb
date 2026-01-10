// Brand and theme constants for Old Dog Systems / 9Count Systems umbrella site.
// Change BRAND_NAME to rebrand globally.
// 
// Brand Story:
// - Old Dog Systems: "You can't teach an old dog new tricks" — but here we are, learning coding and apps at 60.
// - 9Count Systems: Boxing analogy — down on the canvas at 9-count, everyone thinks it's over. But we get up, dust off, wash the blood away, and come back swinging.

export const BRAND_NAME = 'Old Dog Systems';
export const ALT_BRAND_NAME = '9Count Systems'; // Alternative brand name for future rebrand

export const THEME = {
  primary: '#38bdf8', // sky-400
  accent: '#a855f7', // purple-500
  background: '#020617', // slate-950
  surface: 'rgba(15,23,42,0.85)', // slate-900 with glassmorphism
  border: 'rgba(148,163,184,0.45)', // slate-400
};

// Utility to inject brand name into any element with [data-brand] attribute.
export function applyBranding() {
  const nodes = document.querySelectorAll('[data-brand]');
  nodes.forEach((node) => {
    node.textContent = BRAND_NAME;
  });
}

// Optionally expose on window for inline script usage without bundling.
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-undef
  window.ODS_CONSTANTS = { BRAND_NAME, THEME, applyBranding };
}

