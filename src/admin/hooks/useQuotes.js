import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { logActivity } from '../utils/activityLogger';
import { generateQuoteNumber } from '../utils/quoteNumberGenerator';

export default function useQuotes(leadId) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lead_quotes')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    setQuotes(data || []);
    setLoading(false);
  }, [leadId]);

  useEffect(() => { fetch(); }, [fetch]);

  const createQuote = async ({ title, description, items, subtotal, vat, total, validUntil }) => {
    const quoteNumber = await generateQuoteNumber();
    const { data, error } = await supabase
      .from('lead_quotes')
      .insert({
        lead_id: leadId,
        quote_number: quoteNumber,
        title,
        description,
        items,
        subtotal,
        vat,
        total,
        valid_until: validUntil,
      })
      .select()
      .single();
    if (!error) {
      await logActivity(leadId, {
        type: 'quote_created',
        title: `Quote ${quoteNumber} created`,
        description: title,
        metadata: { quote_id: data.id, quote_number: quoteNumber, total },
      });
      await fetch();
    }
    return { data, error };
  };

  const updateQuoteStatus = async (quoteId, status) => {
    const { error } = await supabase
      .from('lead_quotes')
      .update({ status })
      .eq('id', quoteId);
    if (!error) {
      const q = quotes.find((q) => q.id === quoteId);
      await logActivity(leadId, {
        type: 'quote_updated',
        title: `Quote ${q?.quote_number || ''} marked ${status}`,
        metadata: { quote_id: quoteId, status },
      });
      await fetch();
    }
    return { error };
  };

  return { quotes, loading, createQuote, updateQuoteStatus, refetch: fetch };
}
