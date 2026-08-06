// Distinct, stable colour per trade contact so cards and their map pins match.
export const CARD_COLORS = [
  '#c5a47e', '#5b8fd4', '#8b7fc7', '#6b8f71', '#d4874e', '#7c6dab',
  '#d4748b', '#4a9c9c', '#b5651d', '#9c3b2e', '#3f7d5a', '#a3547e',
];

export function contactColor(seed) {
  const s = String(seed || '');
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return CARD_COLORS[h % CARD_COLORS.length];
}
