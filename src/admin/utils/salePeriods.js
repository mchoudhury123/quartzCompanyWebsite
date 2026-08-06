// Sale-period helpers: assign a lead to the sale period it came in under and
// map "how many periods ago" to a colour category for the Clients list.
//
// A lead belongs to the most recent period whose start date is on or before
// the lead's created date. periodsAgo is that period's position in the
// newest-first list (0 = current sale, 1 = last sale, 2 = two ago, …).

// Newest-first by start_date. (useSalePeriods already returns this order, but
// callers can re-sort defensively.)
export function sortPeriodsDesc(periods = []) {
  return [...periods].sort((a, b) => {
    if (a.start_date === b.start_date) return 0;
    return a.start_date < b.start_date ? 1 : -1;
  });
}

// Returns { period, periodsAgo } or null when the lead predates every period.
export function assignLeadPeriod(createdAt, periodsDesc = []) {
  if (!createdAt || !periodsDesc.length) return null;
  const created = String(createdAt).slice(0, 10); // YYYY-MM-DD
  for (let i = 0; i < periodsDesc.length; i++) {
    if (periodsDesc[i].start_date && periodsDesc[i].start_date <= created) {
      return { period: periodsDesc[i], periodsAgo: i };
    }
  }
  return null;
}

// Colour category by recency:
//   current (0)  → green (rich)   this sale
//   last (1)     → green (light)  last sale
//   mid (2)      → orange         two periods ago
//   old (3+)     → red            three or more periods ago
export function periodCategory(periodsAgo) {
  if (periodsAgo === 0) return 'current';
  if (periodsAgo === 1) return 'last';
  if (periodsAgo === 2) return 'mid';
  return 'old';
}

const CATEGORY_LABELS = {
  current: 'This sale',
  last: 'Last sale',
  mid: '2 sales ago',
  old: '3+ sales ago',
};

export function categoryLabel(category) {
  return CATEGORY_LABELS[category] || '';
}
