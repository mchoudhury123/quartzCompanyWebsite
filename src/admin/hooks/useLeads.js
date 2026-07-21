import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { logActivity } from '../utils/activityLogger';

const PRESET_FILTERS = {
  new_quotes: { label: 'New Quote Requests' },
  contacted: { label: 'Contacted' },
  samples: { label: 'Samples' },
  follow_up: { label: 'Quotes' },
  deposits: { label: 'Deposits' },
  completed: { label: 'Completed' },
  cold: { label: 'Cold Leads' },
  appointments: { label: 'Appointments' },
  chase_measurements: { label: 'Chase Measurements' },
  action_required: { label: 'Action Required' },
  newsletter: { label: 'Stay Inspired' },
};

export { PRESET_FILTERS };

export default function useLeads(initialFilter) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [presetFilter, setPresetFilter] = useState(initialFilter || '');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    async function fetchLeads() {
      setLoading(true);

      let query = supabase
        .from('leads')
        .select('*')
        .order(sortField, { ascending: sortAsc });

      if (presetFilter) {
        switch (presetFilter) {
          case 'new_quotes':
            // Any lead whose status is 'new', except newsletter signups (which have their
            // own "Stay Inspired" tile). `source.is.null` keeps leads with no source set.
            // Must stay identical to the dashboard tile count in useDashboardStats.
            query = query.eq('status', 'new').or('source.is.null,source.neq.newsletter');
            break;
          case 'contacted':
            // Leads that answered and spoke to sales — marked via the status dropdown.
            query = query.eq('status', 'contacted');
            break;
          case 'samples':
            query = query.eq('want_samples', true);
            break;
          case 'follow_up':
            query = query.eq('status', 'quoted');
            break;
          case 'deposits':
            query = query.eq('status', 'deposit');
            break;
          case 'completed':
            query = query.eq('status', 'won');
            break;
          case 'cold':
            query = query.eq('status', 'cold');
            break;
          case 'chase_measurements':
            query = query.eq('pending_action', 'chase_measurements');
            break;
          case 'action_required':
            query = query.eq('pending_action', 'action_required');
            break;
          case 'newsletter':
            query = query.eq('source', 'newsletter');
            break;
          case 'appointments':
            query = query.eq('status', '__none__');
            break;
        }
      } else if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (search.trim()) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      const { data, error } = await query;
      let rows = !error && data ? data : [];

      // Deposits view: flag which leads have had a deposit marked paid (so the
      // list splits into "Pending" vs "Taken"), and surface the predicted payment
      // date on pending deposits so admins know when to expect / chase payment.
      if (presetFilter === 'deposits' && rows.length) {
        const { data: quoteRows } = await supabase
          .from('lead_quotes')
          .select('id, lead_id, deposit_paid, deposit_expected_date, quote_number');
        const paidSet = new Set();
        const expectedByLead = {};
        (quoteRows || []).forEach((q) => {
          if (q.deposit_paid) paidSet.add(q.lead_id);
          if (q.deposit_expected_date) {
            const current = expectedByLead[q.lead_id];
            // Keep the soonest expected date if a lead has more than one.
            if (!current || q.deposit_expected_date < current.date) {
              expectedByLead[q.lead_id] = { date: q.deposit_expected_date, quoteId: q.id, quoteNumber: q.quote_number };
            }
          }
        });
        rows = rows.map((l) => ({
          ...l,
          _depositTaken: paidSet.has(l.id),
          _depositExpectedDate: expectedByLead[l.id]?.date || null,
          _depositQuoteId: expectedByLead[l.id]?.quoteId || null,
          _depositQuoteNumber: expectedByLead[l.id]?.quoteNumber || null,
        }));
      }

      setLeads(rows);
      setLoading(false);
    }

    fetchLeads();
  }, [statusFilter, presetFilter, search, sortField, sortAsc]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const clearPresetFilter = () => {
    setPresetFilter('');
  };

  // Mark a client's pending deposit as received, straight from the deposits list.
  // Records payment on the pending quote, clears the prediction, and moves the
  // lead into "Deposit Taken". Does not email the customer.
  const markDepositTaken = async (lead) => {
    const quoteId = lead._depositQuoteId;
    if (!quoteId) return { error: new Error('No pending deposit found for this client.') };
    const nowIso = new Date().toISOString();
    const { error } = await supabase
      .from('lead_quotes')
      .update({ deposit_paid: true, deposit_paid_at: nowIso, status: 'accepted' })
      .eq('id', quoteId);
    if (error) return { error };
    await supabase.from('lead_quotes').update({ deposit_expected_date: null }).eq('lead_id', lead.id);
    await supabase.from('leads').update({ status: 'deposit' }).eq('id', lead.id);
    try {
      await logActivity(lead.id, {
        type: 'deposit_paid',
        title: `Deposit paid${lead._depositQuoteNumber ? ` — ${lead._depositQuoteNumber}` : ''}`,
        description: 'Deposit marked received from the deposits list',
        metadata: { quote_id: quoteId, payment_method: 'bank_transfer' },
      });
    } catch (_) { /* activity log is best-effort */ }
    setLeads((prev) => prev.map((l) => (
      l.id === lead.id ? { ...l, _depositTaken: true, _depositExpectedDate: null } : l
    )));
    return { error: null };
  };

  const deleteLead = async (leadId) => {
    const { error } = await supabase.from('leads').delete().eq('id', leadId);
    if (!error) {
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
    }
    return { error };
  };

  return { leads, loading, statusFilter, setStatusFilter, presetFilter, setPresetFilter, clearPresetFilter, search, setSearch, sortField, sortAsc, toggleSort, deleteLead, markDepositTaken };
}
