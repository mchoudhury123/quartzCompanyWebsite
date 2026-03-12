import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const PRESET_FILTERS = {
  new_quotes: { label: 'New Quote Requests' },
  repeat_quotes: { label: '1+ Quote Requests' },
  new_quotes_self_serve: { label: 'New Quote Requests Self Serve' },
  repeat_quotes_self_serve: { label: '1+ Quote Requests Self Serve' },
  samples: { label: 'Samples' },
  follow_up: { label: 'Follow Up Quotes' },
  deposits: { label: 'Deposits' },
  appointments: { label: 'Appointments' },
  pro_welcome: { label: 'Pro Welcome' },
  chase_measurements: { label: 'Chase Measurements' },
  other_tasks: { label: 'Other Tasks' },
  compliance_tasks: { label: 'Compliance Tasks' },
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

      const needsCallFilter = presetFilter === 'repeat_quotes' || presetFilter === 'repeat_quotes_self_serve';

      if (needsCallFilter) {
        // Fetch all non-closed leads + their outbound unanswered calls
        const sourceFilter = presetFilter === 'repeat_quotes_self_serve' ? 'contact_form' : null;

        let leadsQuery = supabase
          .from('leads')
          .select('*')
          .not('status', 'in', '("won","lost")')
          .order(sortField, { ascending: sortAsc });

        if (sourceFilter) {
          leadsQuery = leadsQuery.eq('source', sourceFilter);
        } else {
          // For repeat_quotes, exclude contact_form source
          leadsQuery = leadsQuery.neq('source', 'contact_form');
        }

        if (search.trim()) {
          leadsQuery = leadsQuery.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
        }

        const [leadsRes, callsRes] = await Promise.all([
          leadsQuery,
          supabase.from('lead_calls').select('lead_id, direction, outcome')
            .eq('direction', 'outbound'),
        ]);

        const allLeads = leadsRes.data || [];
        const allOutboundCalls = callsRes.data || [];

        // Filter to unanswered outcomes in JS
        const unansweredOutcomes = ['no_answer', 'voicemail', 'busy'];
        const calls = allOutboundCalls.filter((c) => unansweredOutcomes.includes(c.outcome));

        // Count unanswered outbound calls per lead
        const missedCallCounts = {};
        calls.forEach((c) => {
          missedCallCounts[c.lead_id] = (missedCallCounts[c.lead_id] || 0) + 1;
        });

        // Filter to leads with 2+ unanswered outbound calls
        const filtered = allLeads.filter((l) => (missedCallCounts[l.id] || 0) >= 2);
        setLeads(filtered);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('leads')
        .select('*')
        .order(sortField, { ascending: sortAsc });

      if (presetFilter) {
        switch (presetFilter) {
          case 'new_quotes':
            query = query.in('source', ['quote_modal', 'quote_page']).eq('status', 'new');
            break;
          case 'new_quotes_self_serve':
            query = query.eq('source', 'contact_form').eq('status', 'new');
            break;
          case 'samples':
            query = query.eq('want_samples', true).not('status', 'in', '("won","lost")');
            break;
          case 'follow_up':
            query = query.eq('status', 'quoted');
            break;
          case 'deposits':
            query = query.eq('status', 'deposit');
            break;
          case 'chase_measurements':
            query = query.eq('pending_action', 'chase_measurements');
            break;
          case 'appointments':
          case 'pro_welcome':
          case 'other_tasks':
          case 'compliance_tasks':
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
      if (!error && data) setLeads(data);
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

  const deleteLead = async (leadId) => {
    const { error } = await supabase.from('leads').delete().eq('id', leadId);
    if (!error) {
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
    }
    return { error };
  };

  return { leads, loading, statusFilter, setStatusFilter, presetFilter, setPresetFilter, clearPresetFilter, search, setSearch, sortField, sortAsc, toggleSort, deleteLead };
}
