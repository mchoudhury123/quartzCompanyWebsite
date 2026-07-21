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

  // Duplicate an existing quote: copies its pieces/sizes/prices into a brand-new
  // draft quote (fresh number, no expiry). The admin can then open it and swap
  // the material/price while keeping all the sizes.
  const duplicateQuote = async (sourceId) => {
    const source = quotes.find((q) => q.id === sourceId);
    if (!source) return { data: null, error: new Error('Quote not found') };
    return createQuote({
      title: source.title,
      description: source.description,
      items: source.items,
      subtotal: source.subtotal,
      vat: source.vat,
      total: source.total,
      validUntil: null,
      depositAmount: source.deposit_amount,
      selectedThickness: source.selected_thickness,
    });
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
      // Deposit is now actually paid — clear any "pending" prediction on this
      // client's quotes so they move cleanly from Pending to Taken.
      await supabase
        .from('lead_quotes')
        .update({ deposit_expected_date: null })
        .eq('lead_id', leadId);
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

  // Flag a deposit as pending with a predicted payment date. Moves the lead to
  // the "deposit" stage so it shows under Pending Deposit. Does NOT email the
  // customer — this is an internal prediction, not a confirmed payment.
  const markDepositPending = async (quoteId, expectedDate) => {
    const { data, error } = await supabase
      .from('lead_quotes')
      .update({ deposit_expected_date: expectedDate })
      .eq('id', quoteId)
      .select()
      .single();
    if (!error) {
      // A client pays a single deposit, so clear any "paid" flag on their other
      // quotes — pressing "Pending Deposit" reliably moves them to Pending.
      await supabase
        .from('lead_quotes')
        .update({ deposit_paid: false, deposit_paid_at: null })
        .eq('lead_id', leadId)
        .eq('deposit_paid', true);
      await supabase.from('leads').update({ status: 'deposit' }).eq('id', leadId);
      try {
        await logActivity(leadId, {
          type: 'deposit_pending',
          title: `Deposit pending${data?.quote_number ? ` — ${data.quote_number}` : ''}`,
          description: `Customer expected to pay deposit by ${expectedDate}`,
          metadata: { quote_id: quoteId, expected_date: expectedDate },
        });
      } catch (_) { /* activity log is best-effort */ }
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

  return { quotes, loading, createQuote, duplicateQuote, updateQuote, updateQuoteStatus, markDepositPending, markDepositPaid, markBalancePaid, refetch: fetch };
}
