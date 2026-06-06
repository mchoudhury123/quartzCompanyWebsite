import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './ReviewPage.css';

export default function ReviewPage() {
  const { quoteId } = useParams();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!quoteId) {
      setLoading(false);
      return;
    }
    supabase
      .from('lead_quotes')
      .select('id, lead_id, quote_number, items')
      .eq('id', quoteId)
      .single()
      .then(({ data }) => {
        setQuote(data || null);
        setLoading(false);
      });
  }, [quoteId]);

  const itemTitle = (item) => {
    if (item.type === 'accessory' || item.product_name) return item.product_name || 'Product';
    if (item.piece_type === 'specialist') return `${item.description || 'Custom Worktop'} (Specialist Worktop)`;
    const base = item.piece_type || 'Worktop';
    return item.description ? `${base} — ${item.description}` : base;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) {
      setError('Please choose a star rating.');
      return;
    }
    setSubmitting(true);
    setError('');

    const { error: insertError } = await supabase.from('reviews').insert({
      lead_id: quote?.lead_id || null,
      quote_id: quote?.id || null,
      customer_name: name.trim() || null,
      rating,
      comment: comment.trim() || null,
    });

    setSubmitting(false);
    if (insertError) {
      console.error('Review save failed:', insertError);
      setError(
        `Sorry, we couldn't save your review${insertError.message ? ` (${insertError.message})` : ''}. Please try again or email us.`
      );
      return;
    }
    setSubmitted(true);
  };

  const items = quote?.items || [];

  return (
    <div className="rv">
      <div className="rv__accent rv__accent--top" />
      <div className="rv__card">
        <div className="rv__logo-wrap">
          <img src="/logo.png" alt="The Quartz Company" className="rv__logo-img" />
        </div>
        <div className="rv__divider" />

        {loading ? (
          <p className="rv__loading">Loading…</p>
        ) : submitted ? (
          <div className="rv__thanks">
            <div className="rv__thanks-stars">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</div>
            <h1 className="rv__thanks-title">Thank you!</h1>
            <p className="rv__thanks-text">
              We really appreciate you taking the time to share your experience with The Quartz Company.
            </p>
          </div>
        ) : (
          <>
            <p className="rv__eyebrow">Your Experience</p>
            <h1 className="rv__title">How did we do?</h1>
            <p className="rv__intro">
              Thank you for choosing The Quartz Company{quote?.quote_number ? ` (order ${quote.quote_number})` : ''}.
              We'd love to hear how everything went.
            </p>

            {items.length > 0 && (
              <div className="rv__order">
                <p className="rv__order-label">Your Order</p>
                {items.map((item, i) => (
                  <span key={i} className="rv__order-item">{itemTitle(item)}</span>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="rv__form">
              <div className="rv__stars" role="radiogroup" aria-label="Star rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    className={`rv__star ${(hover || rating) >= n ? 'rv__star--on' : ''}`}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <label className="rv__field">
                <span className="rv__field-label">Your name</span>
                <input
                  className="rv__input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Daniel Rance"
                />
              </label>

              <label className="rv__field">
                <span className="rv__field-label">Your review</span>
                <textarea
                  className="rv__textarea"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your worktops and the service you received…"
                  rows={5}
                />
              </label>

              {error && <p className="rv__error">{error}</p>}

              <button type="submit" className="rv__submit" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          </>
        )}

        <div className="rv__footer">
          <p className="rv__footer-brand">The Quartz Company</p>
          <p className="rv__footer-details">sales@thequartzcompany.co.uk &nbsp;·&nbsp; 07375 303 416</p>
        </div>
      </div>
      <div className="rv__accent rv__accent--bottom" />
    </div>
  );
}
