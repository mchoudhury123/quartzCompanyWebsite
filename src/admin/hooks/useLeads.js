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
      let query = supabase
        .from('leads')
        .select('*')
        .order(sortField, { ascending: sortAsc });

      if (presetFilter) {
        switch (presetFilter) {
          case 'new_quotes':
            query = query.eq('source', 'quote_modal').eq('status', 'new');
            break;
          case 'repeat_quotes':
            // Fetched client-side — get all quote_modal leads, filter repeats after
            query = query.eq('source', 'quote_modal').eq('status', 'new');
            break;
          case 'new_quotes_self_serve':
            query = query.eq('source', 'contact_form').eq('status', 'new');
            break;
          case 'repeat_quotes_self_serve':
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
          case 'appointments':
          case 'pro_welcome':
          case 'chase_measurements':
          case 'other_tasks':
          case 'compliance_tasks':
            // These categories don't have data yet — show empty
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

  return { leads, loading, statusFilter, setStatusFilter, presetFilter, setPresetFilter, clearPresetFilter, search, setSearch, sortField, sortAsc, toggleSort };
}
