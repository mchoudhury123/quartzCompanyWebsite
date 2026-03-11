import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

export default function useActivities(leadId) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    setActivities(data || []);
    setLoading(false);
  }, [leadId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { activities, loading, refetch: fetch };
}
