import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const PRESET_FILTERS = {
  new_quotes: { label: 'New Quote Requests' },
  new_enquiries: { label: 'New Enquiries' },
  samples: { label: 'Samples to Send' },
  callbacks: { label: 'Callbacks Requested' },
  follow_up: { label: 'Follow Up Quotes' },
  deposits: { label: 'Deposits' },
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

      // Apply preset filter from dashboard cards
      if (presetFilter) {
        switch (presetFilter) {
          case 'new_quotes':
            query = query.eq('source', 'quote_modal').eq('status', 'new');
            break;
          case 'new_enquiries':
            query = query.eq('source', 'contact_form').eq('status', 'new');
            break;
          case 'samples':
            query = query.eq('want_samples', true).not('status', 'in', '("won","lost")');
            break;
          case 'callbacks':
            query = query.eq('want_callback', true).not('status', 'in', '("won","lost")');
            break;
          case 'follow_up':
            query = query.eq('status', 'quoted');
            break;
          case 'deposits':
            query = query.eq('status', 'deposit');
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
