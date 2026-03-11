import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { logActivity } from '../utils/activityLogger';

export default function useSamples(leadId) {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lead_samples')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    setSamples(data || []);
    setLoading(false);
  }, [leadId]);

  useEffect(() => { fetch(); }, [fetch]);

  const createSample = async ({ productName, colour, material, notes }) => {
    const { data, error } = await supabase
      .from('lead_samples')
      .insert({
        lead_id: leadId,
        product_name: productName,
        colour,
        material,
        notes,
      })
      .select()
      .single();
    if (!error) {
      await logActivity(leadId, {
        type: 'sample_requested',
        title: `Sample requested: ${productName}`,
        description: [colour, material].filter(Boolean).join(', '),
        metadata: { sample_id: data.id },
      });
      await fetch();
    }
    return { data, error };
  };

  const updateSampleStatus = async (sampleId, status) => {
    const updates = { status };
    if (status === 'sent') updates.sent_at = new Date().toISOString();
    if (status === 'delivered') updates.delivered_at = new Date().toISOString();

    const { error } = await supabase
      .from('lead_samples')
      .update(updates)
      .eq('id', sampleId);
    if (!error) {
      const s = samples.find((s) => s.id === sampleId);
      const actType = status === 'sent' ? 'sample_sent' : status === 'delivered' ? 'sample_delivered' : 'sample_requested';
      await logActivity(leadId, {
        type: actType,
        title: `Sample ${s?.product_name || ''} marked ${status}`,
        metadata: { sample_id: sampleId, status },
      });
      await fetch();
    }
    return { error };
  };

  return { samples, loading, createSample, updateSampleStatus, refetch: fetch };
}
