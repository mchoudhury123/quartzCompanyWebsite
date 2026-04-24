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
    templateMeasure: 0,
    followUpCall: 0,
    proWelcome: 0,
    chaseMeasurements: 0,
    otherTasks: 0,
    complianceTasks: 0,
    newsletter: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data: leads } = await supabase
        .from('leads')
        .select('id, email, source, status, want_samples, want_callback, pending_action');

      const allLeads = leads || [];

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
        templateMeasure: 0,
        followUpCall: 0,
        proWelcome: 0,
        chaseMeasurements: 0,
        otherTasks: 0,
        complianceTasks: 0,
        newsletter: 0,
      };

      allLeads.forEach((l) => {
        // 1+ Quote Requests: status is still 'new' but pending_action was cleared
        // (admin said "no answer" twice via action bar). Newsletter signups
        // are tracked separately so they don't clutter the repeat buckets.
        const isRepeat = l.status === 'new' && !l.pending_action && l.source !== 'newsletter';

        if (isRepeat) {
          if (l.source === 'contact_form') {
            c.repeatQuotesSelfServe++;
          } else {
            c.repeatQuotes++;
          }
        }

        // New Quote Requests: new leads that still have a pending action (call_new or follow_up)
        if ((l.source === 'quote_modal' || l.source === 'quote_page') && l.status === 'new' && l.pending_action) {
          c.newQuotes++;
        }
        if (l.source === 'contact_form' && l.status === 'new' && l.pending_action) {
          c.newQuotesSelfServe++;
        }

        if (l.source === 'newsletter' && l.status === 'new') c.newsletter++;

        if (l.status === 'quoted') c.followUp++;
        if (l.status === 'deposit') c.deposits++;
        if (l.pending_action === 'chase_measurements') c.chaseMeasurements++;
      });

      // Count samples with status 'preparing' (shown on CRM Samples page)
      const { count: samplesCount } = await supabase
        .from('lead_samples')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'preparing');
      c.samples = samplesCount || 0;

      // Count upcoming scheduled appointments (all + by type within next 3 weeks)
      const todayStr = new Date().toISOString().split('T')[0];
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() + 21);
      const cutoffStr = cutoff.toISOString().split('T')[0];

      const { count: apptCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scheduled')
        .gte('date', todayStr);
      c.appointments = apptCount || 0;

      const { data: upcomingAppts } = await supabase
        .from('appointments')
        .select('title')
        .eq('status', 'scheduled')
        .gte('date', todayStr)
        .lte('date', cutoffStr);

      (upcomingAppts || []).forEach((a) => {
        if (a.title === 'Template / Measure') c.templateMeasure++;
        else if (a.title === 'Follow Up Call') c.followUpCall++;
      });

      setCounts(c);

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
