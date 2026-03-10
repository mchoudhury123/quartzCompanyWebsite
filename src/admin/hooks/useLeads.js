import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function useLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
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

      if (statusFilter !== 'all') {
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
  }, [statusFilter, search, sortField, sortAsc]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return { leads, loading, statusFilter, setStatusFilter, search, setSearch, sortField, sortAsc, toggleSort };
}
