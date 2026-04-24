import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

export default function useTradeContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trade_contacts')
      .select('*')
      .eq('active', true)
      .order('name', { ascending: true });
    if (error) console.error('Failed to fetch trade contacts:', error.message);
    setContacts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const createContact = async (contact) => {
    const { data, error } = await supabase
      .from('trade_contacts')
      .insert(contact)
      .select()
      .single();
    if (!error) await fetchAll();
    return { data, error };
  };

  const updateContact = async (id, updates) => {
    const { error } = await supabase
      .from('trade_contacts')
      .update(updates)
      .eq('id', id);
    if (!error) await fetchAll();
    return { error };
  };

  const deleteContact = async (id) => {
    const { error } = await supabase
      .from('trade_contacts')
      .delete()
      .eq('id', id);
    if (!error) await fetchAll();
    return { error };
  };

  return { contacts, loading, createContact, updateContact, deleteContact, refetch: fetchAll };
}
