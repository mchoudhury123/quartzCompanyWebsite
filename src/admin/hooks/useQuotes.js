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

  const createQuote = async ({ title, description, items, subtotal, vat, total, validUntil, depositAmount, selectedThickness }) => {
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
        deposit_amount: depositAmount || 0,
        selected_thickness: selectedThickness || '20mm',
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

  const updateQuote = async (quoteId, updates) => {
    const { data, error } = await supabase
      .from('lead_quotes')
      .update(updates)
      .eq('id', quoteId)
      .select()
      .single();
    if (!error) {
      await logActivity(leadId, {
        type: 'quote_updated',
        title: `Quote updated`,
        description: updates.title || '',
        metadata: { quote_id: quoteId },
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

  // Mark a deposit/balance as received via bank transfer: sets the paid flags +
  // timestamps, advances the lead stage, and logs the payment. The confirmation
  // email to the customer is sent by the caller (it needs the lead's email).
  const markDepositPaid = async (quoteId) => {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from('lead_quotes')
      .update({ deposit_paid: true, deposit_paid_at: nowIso, status: 'accepted' })
      .eq('id', quoteId)
      .select()
      .single();
    if (!error) {
      await supabase.from('leads').update({ status: 'deposit' }).eq('id', leadId);
      await logActivity(leadId, {
        type: 'deposit_paid',
        title: `Deposit paid${data?.quote_number ? ` — ${data.quote_number}` : ''}`,
        description: `£${Number(data?.deposit_amount || 0).toFixed(2)} received via bank transfer`,
        metadata: { quote_id: quoteId, payment_method: 'bank_transfer' },
      });
      await fetch();
    }
    return { data, error };
  };

  const markBalancePaid = async (quoteId) => {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from('lead_quotes')
      .update({ balance_paid: true, balance_paid_at: nowIso })
      .eq('id', quoteId)
      .select()
      .single();
    if (!error) {
      const balance = Math.max(0, Number(data?.total || 0) - Number(data?.deposit_amount || 0));
      await supabase.from('leads').update({ status: 'won' }).eq('id', leadId);
      await logActivity(leadId, {
        type: 'balance_paid',
        title: `Balance paid — paid in full${data?.quote_number ? ` — ${data.quote_number}` : ''}`,
        description: `£${balance.toFixed(2)} received via bank transfer`,
        metadata: { quote_id: quoteId, payment_method: 'bank_transfer' },
      });
      await fetch();
    }
    return { data, error };
  };

  return { quotes, loading, createQuote, updateQuote, updateQuoteStatus, markDepositPaid, markBalancePaid, refetch: fetch };
}
