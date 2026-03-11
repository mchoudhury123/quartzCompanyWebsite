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
      // Fetch leads and all outbound calls in parallel
      const [leadsRes, callsRes] = await Promise.all([
        supabase.from('leads').select('id, email, source, status, want_samples, want_callback'),
        supabase.from('lead_calls').select('lead_id, direction, outcome')
          .eq('direction', 'outbound'),
      ]);

      const leads = leadsRes.data || [];
      const allOutboundCalls = callsRes.data || [];

      // Filter to unanswered calls (no_answer, voicemail, busy) in JS
      const unansweredOutcomes = ['no_answer', 'voicemail', 'busy'];
      const calls = allOutboundCalls.filter((c) => unansweredOutcomes.includes(c.outcome));

      // Count unanswered outbound calls per lead
      const missedCallCounts = {};
      calls.forEach((c) => {
        missedCallCounts[c.lead_id] = (missedCallCounts[c.lead_id] || 0) + 1;
      });

      // Set of lead IDs with 2+ unanswered outbound calls
      const flaggedLeadIds = new Set(
        Object.entries(missedCallCounts)
          .filter(([, count]) => count >= 2)
          .map(([id]) => id)
      );

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
        const isFlagged = flaggedLeadIds.has(l.id);

        // 1+ Quote Requests: leads with 2+ unanswered outbound calls (not closed)
        if (isFlagged && !closedStatuses.includes(l.status)) {
          if (l.source === 'contact_form') {
            c.repeatQuotesSelfServe++;
          } else {
            c.repeatQuotes++;
          }
        }

        // New Quote Requests: new leads without the flag
        if ((l.source === 'quote_modal' || l.source === 'quote_page') && l.status === 'new' && !isFlagged) {
          c.newQuotes++;
        }
        if (l.source === 'contact_form' && l.status === 'new' && !isFlagged) {
          c.newQuotesSelfServe++;
        }

        if (l.want_samples && !closedStatuses.includes(l.status)) c.samples++;
        if (l.status === 'quoted') c.followUp++;
        if (l.status === 'deposit') c.deposits++;
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
