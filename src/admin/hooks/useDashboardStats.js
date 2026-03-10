import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function useDashboardStats() {
  const [counts, setCounts] = useState({
    newQuotes: 0,
    repeatQuotes: 0,
    newQuotesSelfServe: 0,
    repeatQuotesSelfServe: 0,
    emails: 0,
    deposits: 0,
    samples: 0,
    followUp: 0,
    appointments: 0,
    proWelcome: 0,
    chaseMeasurements: 0,
    otherTasks: 0,
    complianceTasks: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('id, email, source, status, want_samples, want_callback');

      if (!error && leads) {
        // Count email occurrences to detect repeat customers
        const emailCounts = {};
        leads.forEach((l) => {
          if (l.email) {
            emailCounts[l.email] = (emailCounts[l.email] || 0) + 1;
          }
        });

        const c = {
          newQuotes: 0,
          repeatQuotes: 0,
          newQuotesSelfServe: 0,
          repeatQuotesSelfServe: 0,
          emails: 0,
          deposits: 0,
          samples: 0,
          followUp: 0,
          appointments: 0,
          proWelcome: 0,
          chaseMeasurements: 0,
          otherTasks: 0,
          complianceTasks: 0,
        };

        const closedStatuses = ['won', 'lost'];

        leads.forEach((l) => {
          const isRepeat = l.email && emailCounts[l.email] > 1;

          if (l.source === 'quote_modal' && l.status === 'new') {
            if (isRepeat) {
              c.repeatQuotes++;
            } else {
              c.newQuotes++;
            }
          }

          if (l.source === 'contact_form' && l.status === 'new') {
            if (isRepeat) {
              c.repeatQuotesSelfServe++;
            } else {
              c.newQuotesSelfServe++;
            }
          }

          if (l.want_samples && !closedStatuses.includes(l.status)) c.samples++;
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
