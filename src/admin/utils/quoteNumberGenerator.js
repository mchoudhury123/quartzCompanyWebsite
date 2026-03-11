import { supabase } from '../../lib/supabase';

/**
 * Generates a sequential quote number like QC-2026-0001.
 * Queries existing quotes to find the next number.
 */
export async function generateQuoteNumber() {
  const year = new Date().getFullYear();
  const prefix = `QC-${year}-`;

  const { data } = await supabase
    .from('lead_quotes')
    .select('quote_number')
    .like('quote_number', `${prefix}%`)
    .order('quote_number', { ascending: false })
    .limit(1);

  let next = 1;
  if (data && data.length > 0) {
    const last = data[0].quote_number;
    const num = parseInt(last.replace(prefix, ''), 10);
    if (!isNaN(num)) next = num + 1;
  }

  return `${prefix}${String(next).padStart(4, '0')}`;
}
