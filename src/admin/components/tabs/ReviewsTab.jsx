import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { buildReviewRequestEmailHtml } from '../../../utils/reviewRequestEmail';
import { FiStar, FiSend } from 'react-icons/fi';
import './ReviewsTab.css';

function Stars({ rating }) {
  return (
    <span className="reviews-tab__stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? 'reviews-tab__star reviews-tab__star--on' : 'reviews-tab__star'}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ReviewsTab({ leadId, lead }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendState, setSendState] = useState('idle'); // 'idle'|'sending'|'sent'|'error'

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*, lead_quotes:quote_id(quote_number)')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    setReviews(data || []);
    setLoading(false);
  }, [leadId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const sendReviewRequest = async () => {
    if (!lead?.email) {
      window.alert("This customer doesn't have an email address on file.");
      return;
    }
    if (!window.confirm(`Send a review request email to ${lead.email}?`)) return;
    setSendState('sending');

    const firstName = (lead.full_name || '').split(' ')[0] || 'there';
    const { subject, html } = buildReviewRequestEmailHtml({
      firstName,
      logoUrl: `${window.location.origin}/logo.png`,
    });

    try {
      const res = await fetch('/api/zoho-send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: lead.email, subject, body: subject, html }),
      });
      const data = await res.json();
      if (data.error) {
        setSendState('error');
        return;
      }
      setSendState('sent');
      try {
        await supabase.from('lead_emails').insert({
          lead_id: leadId,
          direction: 'outbound',
          subject,
          body: 'Review request email (Google)',
          to_address: lead.email,
          from_address: 'sales@thequartzcompany.co.uk',
          zoho_message_id: data.messageId || null,
          status: 'sent',
          sent_by: 'Admin',
        });
      } catch (_) {
        /* logging is best-effort */
      }
    } catch (_) {
      setSendState('error');
    }
  };

  const sendLabel = () => {
    switch (sendState) {
      case 'sending': return 'Sending…';
      case 'sent': return 'Review request sent ✓';
      case 'error': return 'Failed — retry';
      default: return 'Send Review Request';
    }
  };

  return (
    <div className="reviews-tab">
      <div className="reviews-tab__header">
        <h3 className="reviews-tab__title">Reviews ({reviews.length})</h3>
        <button
          className="reviews-tab__send"
          onClick={sendReviewRequest}
          disabled={sendState === 'sending'}
        >
          <FiSend /> {sendLabel()}
        </button>
      </div>

      <p className="reviews-tab__hint">
        Sends this customer a branded email thanking them for choosing The Quartz Company and
        inviting them to leave a review on Google.
      </p>

      {loading ? (
        <p className="reviews-tab__empty">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="reviews-tab__empty">
          This customer hasn't left a review yet. Any review they leave will appear here and in the
          main Reviews section.
        </p>
      ) : (
        <div className="reviews-tab__list">
          {reviews.map((r) => (
            <div className="reviews-tab__card" key={r.id}>
              <Stars rating={r.rating} />
              {r.comment && <p className="reviews-tab__comment">“{r.comment}”</p>}
              <div className="reviews-tab__meta">
                <span className="reviews-tab__name">{r.customer_name || lead?.full_name || 'Anonymous'}</span>
                <span className="reviews-tab__dot">·</span>
                <span className="reviews-tab__date">{formatDate(r.created_at)}</span>
                {r.lead_quotes?.quote_number && (
                  <>
                    <span className="reviews-tab__dot">·</span>
                    <span className="reviews-tab__quote">{r.lead_quotes.quote_number}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
