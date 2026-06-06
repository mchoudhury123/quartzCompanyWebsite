import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { FiTrash2, FiStar } from 'react-icons/fi';
import './ReviewsPage.css';

function Stars({ rating }) {
  return (
    <span className="reviews-page__stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? 'reviews-page__star reviews-page__star--on' : 'reviews-page__star'}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*, leads:lead_id(full_name), lead_quotes:quote_id(quote_number)')
      .order('created_at', { ascending: false });
    setReviews(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const count = reviews.length;
  const average = count
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / count).toFixed(1)
    : '0.0';

  if (loading) return <div className="admin-page-loading">Loading reviews...</div>;

  return (
    <div className="reviews-page">
      <div className="reviews-page__header">
        <h1 className="reviews-page__title">Reviews</h1>
        {count > 0 && (
          <div className="reviews-page__summary">
            <FiStar className="reviews-page__summary-icon" />
            <span className="reviews-page__summary-avg">{average}</span>
            <span className="reviews-page__summary-count">/ 5 · {count} review{count !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {count === 0 ? (
        <p className="reviews-page__empty">No reviews yet. They'll appear here once customers leave one.</p>
      ) : (
        <div className="reviews-page__list">
          {reviews.map((r) => {
            const name = r.customer_name || r.leads?.full_name || 'Anonymous';
            return (
              <div className="reviews-page__card" key={r.id}>
                <div className="reviews-page__card-top">
                  <Stars rating={r.rating} />
                  <button
                    className="reviews-page__delete"
                    onClick={() => handleDelete(r.id)}
                    title="Delete review"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                {r.comment && <p className="reviews-page__comment">“{r.comment}”</p>}
                <div className="reviews-page__meta">
                  <span className="reviews-page__name">{name}</span>
                  <span className="reviews-page__dot">·</span>
                  <span className="reviews-page__date">{formatDate(r.created_at)}</span>
                  {r.lead_quotes?.quote_number && (
                    <>
                      <span className="reviews-page__dot">·</span>
                      <span className="reviews-page__quote">{r.lead_quotes.quote_number}</span>
                    </>
                  )}
                  {r.lead_id && (
                    <>
                      <span className="reviews-page__dot">·</span>
                      <Link className="reviews-page__link" to={`/admin/leads/${r.lead_id}`}>
                        View client
                      </Link>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
