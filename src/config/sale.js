// Fallback sale end date for the customer-facing site.
// The live date now comes from the currently-running Sale Period in the admin
// (see SaleProvider); these values are only used if no active sale period is
// found in the database (e.g. before any period is set up).
export const SALE_END = new Date('2026-08-12T23:59:59');
export const SALE_END_LABEL = '12th August';
export const SALE_NAME = 'Summer Sale';

// Formats a YYYY-MM-DD date as an ordinal label like "12th August".
export function formatSaleLabel(dateStr) {
  if (!dateStr) return SALE_END_LABEL;
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return SALE_END_LABEL;
  const day = d.getDate();
  const month = d.toLocaleDateString('en-GB', { month: 'long' });
  const v = day % 100;
  const suffix = ['th', 'st', 'nd', 'rd'][(v - 20) % 10] || ['th', 'st', 'nd', 'rd'][v] || 'th';
  return `${day}${suffix} ${month}`;
}
