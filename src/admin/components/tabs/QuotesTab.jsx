import useQuotes from '../../hooks/useQuotes';
import StatusBadge from '../StatusBadge';
import { FiPlus } from 'react-icons/fi';
import './QuotesTab.css';

const QUOTE_STATUS_MAP = {
  draft: 'new',
  sent: 'contacted',
  accepted: 'won',
  rejected: 'lost',
  expired: 'lost',
};

export default function QuotesTab({ leadId, onCreateQuote }) {
  const { quotes, loading, updateQuoteStatus } = useQuotes(leadId);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }) : '—';

  const formatCurrency = (v) => `£${Number(v || 0).toFixed(2)}`;

  if (loading) return <div className="quotes-tab__loading">Loading quotes...</div>;

  return (
    <div className="quotes-tab">
      <div className="quotes-tab__header">
        <h3 className="quotes-tab__title">Quotes ({quotes.length})</h3>
        <button className="quotes-tab__add" onClick={onCreateQuote}>
          <FiPlus /> New Quote
        </button>
      </div>
      {quotes.length === 0 ? (
        <p className="quotes-tab__empty">No quotes yet. Create one to get started.</p>
      ) : (
        <div className="quotes-tab__list">
          {quotes.map((q) => (
            <div className="quotes-tab__card" key={q.id}>
              <div className="quotes-tab__card-top">
                <div>
                  <span className="quotes-tab__card-number">{q.quote_number}</span>
                  <span className="quotes-tab__card-title">{q.title}</span>
                </div>
                <StatusBadge status={QUOTE_STATUS_MAP[q.status] || q.status} label={q.status} />
              </div>
              {q.description && <p className="quotes-tab__card-desc">{q.description}</p>}
              <div className="quotes-tab__card-footer">
                <span className="quotes-tab__card-total">{formatCurrency(q.total)}</span>
                <span className="quotes-tab__card-date">Valid until: {formatDate(q.valid_until)}</span>
              </div>
              <div className="quotes-tab__card-actions">
                {q.status === 'draft' && (
                  <button className="quotes-tab__action" onClick={() => updateQuoteStatus(q.id, 'sent')}>Mark Sent</button>
                )}
                {q.status === 'sent' && (
                  <>
                    <button className="quotes-tab__action quotes-tab__action--accept" onClick={() => updateQuoteStatus(q.id, 'accepted')}>Accept</button>
                    <button className="quotes-tab__action quotes-tab__action--reject" onClick={() => updateQuoteStatus(q.id, 'rejected')}>Reject</button>
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
