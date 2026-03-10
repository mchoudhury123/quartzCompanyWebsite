import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function useDashboardStats() {
  const [counts, setCounts] = useState({
    newQuotes: 0,
    newEnquiries: 0,
    samples: 0,
    callbacks: 0,
    followUp: 0,
    deposits: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('id, source, status, want_samples, want_callback');

      if (!error && leads) {
        const c = { newQuotes: 0, newEnquiries: 0, samples: 0, callbacks: 0, followUp: 0, deposits: 0 };
        const closedStatuses = ['won', 'lost'];

        leads.forEach((l) => {
          if (l.source === 'quote_modal' && l.status === 'new') c.newQuotes++;
          if (l.source === 'contact_form' && l.status === 'new') c.newEnquiries++;
          if (l.want_samples && !closedStatuses.includes(l.status)) c.samples++;
          if (l.want_callback && !closedStatuses.includes(l.status)) c.callbacks++;
          if (l.status === 'quoted') c.followUp++;
          if (l.status === 'deposit') c.deposits++;
        });

        setCounts(c);
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

  return { counts, recentLeads, loading };
}
