export const LEAD_SOURCE_LABEL = {
  admin: 'Manually Added',
  quote_modal: 'Quote Request',
  quote_page: 'Quote Request',
  contact_form: 'Contact Form',
  newsletter: 'Stay Inspired',
};

export function sourceLabel(source) {
  if (!source) return '—';
  return LEAD_SOURCE_LABEL[source] || source;
}
