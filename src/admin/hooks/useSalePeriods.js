import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

// Named sale campaigns with a date range, newest first. Used to colour-code
// the Clients list and managed from the Sale Periods admin screen.
export default function useSalePeriods() {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPeriods = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sale_periods')
      .select('*')
      .order('start_date', { ascending: false });
    if (error) console.error('Failed to fetch sale periods:', error.message);
    setPeriods(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPeriods(); }, [fetchPeriods]);

  const createPeriod = async ({ name, start_date, end_date }) => {
    const { data, error } = await supabase
      .from('sale_periods')
      .insert({ name, start_date, end_date: end_date || null })
      .select()
      .single();
    if (!error) await fetchPeriods();
    return { data, error };
  };

  const updatePeriod = async (id, updates) => {
    const { error } = await supabase
      .from('sale_periods')
      .update(updates)
      .eq('id', id);
    if (!error) await fetchPeriods();
    return { error };
  };

  const deletePeriod = async (id) => {
    const { error } = await supabase.from('sale_periods').delete().eq('id', id);
    if (!error) await fetchPeriods();
    return { error };
  };

  return { periods, loading, createPeriod, updatePeriod, deletePeriod, refetch: fetchPeriods };
}
