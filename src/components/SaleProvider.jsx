import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SALE_END, SALE_END_LABEL, SALE_NAME, formatSaleLabel } from '../config/sale';

/**
 * Makes the customer-facing sale end date come from the currently-running
 * Sale Period in the admin, so it updates site-wide (ticker, banners, countdown
 * popup) whenever a director changes the sale — no code edit needed.
 *
 * The "active" sale is the most recent period that has started and not yet
 * ended. If none is found (or the fetch fails / table is empty), we fall back
 * to the hardcoded config date so the site never shows a broken sale.
 */
const SaleContext = createContext({
  endDate: SALE_END,
  endLabel: SALE_END_LABEL,
  name: SALE_NAME,
});

export function useSale() {
  return useContext(SaleContext);
}

export function SaleProvider({ children }) {
  const [sale, setSale] = useState({
    endDate: SALE_END,
    endLabel: SALE_END_LABEL,
    name: SALE_NAME,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('sale_periods')
        .select('name, start_date, end_date')
        .order('start_date', { ascending: false });

      if (cancelled || error || !data || !data.length) return;

      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      // Most recent period that has started and not yet ended (data is newest-first).
      const active = data.find(
        (p) => p.start_date && p.start_date <= today && (!p.end_date || p.end_date >= today)
      );

      if (active) {
        setSale({
          endDate: active.end_date ? new Date(`${active.end_date}T23:59:59`) : SALE_END,
          endLabel: active.end_date ? formatSaleLabel(active.end_date) : SALE_END_LABEL,
          name: active.name || SALE_NAME,
        });
      }
      // else: keep the config fallback already in state
    })();
    return () => { cancelled = true; };
  }, []);

  return <SaleContext.Provider value={sale}>{children}</SaleContext.Provider>;
}
