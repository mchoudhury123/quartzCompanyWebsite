import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function useQuoteDetail(quoteId) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(!!quoteId);

  useEffect(() => {
    if (!quoteId) return;
    setLoading(true);
    supabase
      .from('lead_quotes')
      .select('*')
      .eq('id', quoteId)
      .single()
      .then(({ data }) => {
        setQuote(data || null);
        setLoading(false);
      });
  }, [quoteId]);

  return { quote, loading };
}
