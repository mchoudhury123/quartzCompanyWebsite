import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function useDashboardStats() {
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, quoted: 0, won: 0, lost: 0 });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('id, status')
        .order('created_at', { ascending: false });

      if (!error && leads) {
        const counts = { total: leads.length, new: 0, contacted: 0, quoted: 0, won: 0, lost: 0 };
        leads.forEach((l) => {
          if (counts[l.status] !== undefined) counts[l.status]++;
        });
        setStats(counts);
      }

      const { data: recent } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (recent) setRecentLeads(recent);
      setLoading(false);
    }

    fetchStats();
  }, []);

  return { stats, recentLeads, loading };
}
