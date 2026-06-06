import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuotes from '../../hooks/useQuotes';
import { supabase } from '../../../lib/supabase';
import { buildBalanceDueEmail } from '../../../utils/depositConfirmationEmail';
import StatusBadge from '../StatusBadge';
import { FiPlus, FiEdit2, FiEye, FiSend } from 'react-icons/fi';
import './QuotesTab.css';

const QUOTE_STATUS_MAP = {
  draft: 'new',
  sent: 'contacted',
  accepted: 'accepted',
  rejected: 'rejected',
  expired: 'expired',
};

export default function QuotesTab({ leadId, onCreateQuote }) {
  const navigate = useNavigate();
  const { quotes, loading, updateQuoteStatus } = useQuotes(leadId);
  const [balanceState, setBalanceState] = useState({}); // { [quoteId]: 'sending'|'sent'|'error' }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }) : '—';

  const formatCurrency = (v) => `£${Number(v || 0).toFixed(2)}`;

  const requestBalance = async (q) => {
    setBalanceState((s) => ({ ...s, [q.id]: 'sending' }));

    const { data: lead } = await supabase
      .from('leads')
      .select('full_name, email')
      .eq('id', leadId)
      .single();

    if (!lead?.email) {
      setBalanceState((s) => ({ ...s, [q.id]: 'error' }));
      return;
    }

    const balance = Math.max(0, Number(q.total || 0) - Number(q.deposit_amount || 0));
    const firstName = (lead.full_name || '').split(' ')[0] || 'there';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { subject, body } = buildBalanceDueEmail({
      firstName,
      quoteNumber: q.quote_number,
      balanceText: formatCurrency(balance),
      payUrl: `${origin}/quote/view/${q.id}`,
    });

    try {
      const res = await fetch('/api/zoho-send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: lead.email, subject, body }),
      });
      const data = await res.json();
      setBalanceState((s) => ({ ...s, [q.id]: data.error ? 'error' : 'sent' }));
    } catch (_) {
      setBalanceState((s) => ({ ...s, [q.id]: 'error' }));
    }
  };

  const balanceLabel = (id) => {
    switch (balanceState[id]) {
      case 'sending': return 'Sending…';
      case 'sent': return 'Balance request sent ✓';
      case 'error': return 'Failed — retry';
      default: return 'Request Balance Payment';
    }
  };

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
          {quotes.map((q) => {
            const balance = Math.max(0, Number(q.total || 0) - Number(q.deposit_amount || 0));
            return (
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

              {(q.deposit_paid || q.balance_paid) && (
                <div className="quotes-tab__payments">
                  {q.balance_paid ? (
                    <span className="quotes-tab__pay-tag quotes-tab__pay-tag--full">✓ Paid in full</span>
                  ) : (
                    <>
                      <span className="quotes-tab__pay-tag">✓ Deposit paid ({formatCurrency(q.deposit_amount)})</span>
                      <span className="quotes-tab__pay-due">Balance due: {formatCurrency(balance)}</span>
                    </>
                  )}
                </div>
              )}

              <div className="quotes-tab__card-actions">
                <a
                  className="quotes-tab__action quotes-tab__action--view"
                  href={`/quote/view/${q.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiEye /> View
                </a>
                {q.status === 'draft' && (
                  <>
                    <button
                      className="quotes-tab__action quotes-tab__action--edit"
                      onClick={() => navigate(`/admin/leads/${leadId}/quote/${q.id}`)}
                    >
                      <FiEdit2 /> Edit
                    </button>
                    <button className="quotes-tab__action" onClick={() => updateQuoteStatus(q.id, 'sent')}>Mark Sent</button>
                  </>
                )}
                {q.status === 'sent' && (
                  <>
                    <button className="quotes-tab__action quotes-tab__action--accept" onClick={() => updateQuoteStatus(q.id, 'accepted')}>Accept</button>
                    <button className="quotes-tab__action quotes-tab__action--reject" onClick={() => updateQuoteStatus(q.id, 'rejected')}>Reject</button>
                  </>
                )}
                {q.deposit_paid && !q.balance_paid && (
                  <button
                    className="quotes-tab__action quotes-tab__action--balance"
                    onClick={() => requestBalance(q)}
                    disabled={balanceState[q.id] === 'sending'}
                  >
                    <FiSend /> {balanceLabel(q.id)}
                  </button>
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
