// Rendering helpers for saved quote line items (lead_quotes.items jsonb).
//
// Careful: the quote builder's in-memory items carry `product_name` and
// `category`, but what gets persisted does NOT — a saved piece only has
// `type`, `piece_type`, `description` and the dimensions. Anything rendering a
// quote or invoice from the database has to derive the label, or it shows a
// blank description column.
//
// The same logic is inlined in quoteEmailTemplate.js, balanceReceiptEmail.js,
// ReviewPage.jsx and QuoteViewPage.jsx; this is the shared version.

export function itemTitle(item) {
  if (!item) return '';
  if (item.type === 'accessory' || item.product_name) {
    return item.product_name || 'Product';
  }
  if (item.piece_type === 'specialist') {
    return `${item.description || 'Custom Worktop'} (Specialist Worktop)`;
  }
  const base = item.piece_type || 'Worktop';
  return item.description ? `${base} — ${item.description}` : base;
}

export function itemDims(item) {
  return item?.x_mm && item?.y_mm ? `${item.x_mm}×${item.y_mm}mm` : '';
}

/**
 * Group items into the document's Materials / Processes / Products sections.
 *
 * Saved items have no `category`, so grouping them would put every worktop
 * under a misleading "Products" heading. When nothing is categorised, return a
 * single unlabelled group and let the caller skip the section headers.
 */
export function groupItems(items = []) {
  const categorised = items.some((i) => i.category);
  if (!categorised) return [{ label: null, items }];

  return [
    { label: 'Materials', items: items.filter((i) => i.category === 'stones') },
    { label: 'Processes', items: items.filter((i) => i.category === 'processes') },
    {
      label: 'Products',
      items: items.filter((i) => i.category !== 'stones' && i.category !== 'processes'),
    },
  ].filter((g) => g.items.length > 0);
}
