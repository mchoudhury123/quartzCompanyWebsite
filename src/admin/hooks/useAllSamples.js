import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { logActivity } from '../utils/activityLogger';

export default function useAllSamples() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lead_samples')
      .select('*, leads:lead_id(id, full_name, email, phone, address)')
      .in('status', ['preparing', 'sent', 'delivered'])
      .order('created_at', { ascending: false });
    setSamples(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateStatus = async (sampleId, newStatus, leadId) => {
    const updates = { status: newStatus };
    if (newStatus === 'sent') updates.sent_at = new Date().toISOString();
    if (newStatus === 'delivered') updates.delivered_at = new Date().toISOString();

    const { error } = await supabase
      .from('lead_samples')
      .update(updates)
      .eq('id', sampleId);

    if (!error) {
      const s = samples.find((x) => x.id === sampleId);
      const actType = newStatus === 'sent' ? 'sample_sent'
        : newStatus === 'delivered' ? 'sample_delivered'
        : 'sample_requested';
      await logActivity(leadId, {
        type: actType,
        title: `Sample ${s?.product_name || ''} marked ${newStatus}`,
        metadata: { sample_id: sampleId, status: newStatus },
      });
      await fetchAll();
    }
    return { error };
  };

  // Group by lead
  const grouped = samples.reduce((acc, s) => {
    const lid = s.lead_id;
    if (!acc[lid]) acc[lid] = { lead: s.leads, samples: [] };
    acc[lid].samples.push(s);
    return acc;
  }, {});

  // Split into preparing vs completed groups
  const preparingGroups = {};
  const completedGroups = {};
  Object.entries(grouped).forEach(([lid, group]) => {
    const prep = group.samples.filter((s) => s.status === 'preparing');
    const comp = group.samples.filter((s) => s.status === 'sent' || s.status === 'delivered');
    if (prep.length > 0) preparingGroups[lid] = { lead: group.lead, samples: prep };
    if (comp.length > 0) completedGroups[lid] = { lead: group.lead, samples: comp };
  });

  return { samples, preparingGroups, completedGroups, loading, updateStatus, refetch: fetchAll };
}
