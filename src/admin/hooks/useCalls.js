import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { logActivity } from '../utils/activityLogger';

export default function useCalls(leadId) {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lead_calls')
      .select('*')
      .eq('lead_id', leadId)
      .order('called_at', { ascending: false });
    setCalls(data || []);
    setLoading(false);
  }, [leadId]);

  useEffect(() => { fetch(); }, [fetch]);

  const logCall = async ({ direction, durationSeconds, outcome, summary }) => {
    const { data, error } = await supabase
      .from('lead_calls')
      .insert({
        lead_id: leadId,
        direction,
        duration_seconds: durationSeconds,
        outcome,
        summary,
      })
      .select()
      .single();
    if (!error) {
      await logActivity(leadId, {
        type: 'call_logged',
        title: `${direction === 'inbound' ? 'Inbound' : 'Outbound'} call — ${outcome || 'completed'}`,
        description: summary,
        metadata: { call_id: data.id, direction, outcome },
      });
      await fetch();
    }
    return { data, error };
  };

  return { calls, loading, logCall, refetch: fetch };
}
