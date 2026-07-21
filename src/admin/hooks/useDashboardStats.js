import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function useDashboardStats() {
  const [counts, setCounts] = useState({
    newQuotes: 0,
    contacted: 0,
    emails: 0,
    deposits: 0,
    samples: 0,
    followUp: 0,
    completed: 0,
    coldLeads: 0,
    appointments: 0,
    followUpCall: 0,
    chaseMeasurements: 0,
    actionRequired: 0,
    newsletter: 0,
    tradeContacts: 0,
    reviews: 0,
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
        contacted: 0,
        emails: 0,
        deposits: 0,
        samples: 0,
        followUp: 0,
        completed: 0,
        coldLeads: 0,
        appointments: 0,
        followUpCall: 0,
        chaseMeasurements: 0,
        actionRequired: 0,
        newsletter: 0,
        tradeContacts: 0,
        reviews: 0,
      };

      allLeads.forEach((l) => {
        // New Quote Requests: any lead whose status is 'new', except newsletter
        // signups (tracked separately). Mirrors the list filter in useLeads.
        if (l.status === 'new' && l.source !== 'newsletter') c.newQuotes++;

        // Contacted: leads that answered the phone and spoke to the sales team,
        // marked by choosing "Contacted" on the lead's status dropdown.
        if (l.status === 'contacted') c.contacted++;

        if (l.source === 'newsletter' && l.status === 'new') c.newsletter++;

        if (l.status === 'quoted') c.followUp++;
        if (l.status === 'deposit') c.deposits++;
        if (l.status === 'won') c.completed++;
        if (l.status === 'cold') c.coldLeads++;
        if (l.pending_action === 'chase_measurements') c.chaseMeasurements++;
        if (l.pending_action === 'action_required') c.actionRequired++;
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
        if (a.title === 'Follow Up Call') c.followUpCall++;
      });

      const { count: tradeCount } = await supabase
        .from('trade_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('active', true);
      c.tradeContacts = tradeCount || 0;

      const { count: reviewsCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });
      c.reviews = reviewsCount || 0;

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
