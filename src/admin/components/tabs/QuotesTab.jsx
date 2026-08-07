import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuotes from '../../hooks/useQuotes';
import { supabase } from '../../../lib/supabase';
import {
  buildBalanceDueEmail,
  buildDepositConfirmationEmail,
  buildBalanceConfirmationEmail,
} from '../../../utils/depositConfirmationEmail';
import StatusBadge from '../StatusBadge';
import ModalShell from '../modals/ModalShell';
import InvoiceModal from '../modals/InvoiceModal';
import { FiPlus, FiEdit2, FiEye, FiSend, FiCheckCircle, FiCopy, FiClock, FiFileText } from 'react-icons/fi';
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
  const { quotes, loading, duplicateQuote, updateQuoteStatus, markDepositPending, markDepositPaid, markBalancePaid } = useQuotes(leadId);
  const [balanceState, setBalanceState] = useState({}); // { [quoteId]: 'sending'|'sent'|'error' }
  const [paidState, setPaidState] = useState({}); // { [quoteId]: 'saving'|'done'|'error' }
  const [copyState, setCopyState] = useState({}); // { [quoteId]: 'copying' }
  const [pendingQuote, setPendingQuote] = useState(null); // quote being flagged as pending
  const [expectedDate, setExpectedDate] = useState('');
  const [savingPending, setSavingPending] = useState(false);
  const [invoiceQuote, setInvoiceQuote] = useState(null); // quote being invoiced

  // Copy a quote into a new draft (same sizes), then open it for editing so the
  // admin can change the material/price.
  const copyQuote = async (q) => {
    setCopyState((s) => ({ ...s, [q.id]: 'copying' }));
    const { data, error } = await duplicateQuote(q.id);
    setCopyState((s) => ({ ...s, [q.id]: undefined }));
    if (error || !data) {
      window.alert(`Couldn't copy the quote: ${error?.message || 'please try again.'}`);
      return;
    }
    navigate(`/admin/leads/${leadId}/quote/${data.id}`);
  };

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
    const { subject, body } = buildBalanceDueEmail({
      firstName,
      quoteNumber: q.quote_number,
      balanceText: formatCurrency(balance),
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

  // Mark a deposit/balance as received via bank transfer, then email the
  // customer their confirmation.
  const markPaid = async (q, type) => {
    const isBalance = type === 'balance';
    const confirmMsg = isBalance
      ? `Mark the balance for ${q.quote_number} as received? This completes the order and emails the customer a paid-in-full confirmation.`
      : `Mark the deposit for ${q.quote_number} as received? This confirms the order and emails the customer a deposit confirmation.`;
    if (!window.confirm(confirmMsg)) return;

    setPaidState((s) => ({ ...s, [q.id]: 'saving' }));
    const { error } = isBalance ? await markBalancePaid(q.id) : await markDepositPaid(q.id);
    if (error) {
      setPaidState((s) => ({ ...s, [q.id]: 'error' }));
      window.alert(`Couldn't record the payment: ${error.message || 'please try again.'}`);
      return;
    }

    // Best-effort confirmation email — the payment is already recorded.
    try {
      const { data: lead } = await supabase
        .from('leads')
        .select('full_name, email')
        .eq('id', leadId)
        .single();
      if (lead?.email) {
        const firstName = (lead.full_name || '').split(' ')[0] || 'there';
        const { subject, body } = isBalance
          ? buildBalanceConfirmationEmail({ firstName, quoteNumber: q.quote_number })
          : buildDepositConfirmationEmail({ firstName, quoteNumber: q.quote_number });
        await fetch('/api/zoho-send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: lead.email, subject, body }),
        });
      }
    } catch (_) {
      /* email is best-effort */
    }
    setPaidState((s) => ({ ...s, [q.id]: 'done' }));
  };

  // Open the "predicted payment date" prompt for a quote.
  const openPending = (q) => {
    setExpectedDate(q.deposit_expected_date || '');
    setPendingQuote(q);
  };

  // Save the predicted date and move the lead into Pending Deposit.
  const savePending = async () => {
    if (!expectedDate || !pendingQuote) return;
    setSavingPending(true);
    const { error } = await markDepositPending(pendingQuote.id, expectedDate);
    setSavingPending(false);
    if (error) {
      window.alert(`Couldn't save the pending deposit: ${error.message || 'please try again.'}`);
      return;
    }
    setPendingQuote(null);
    setExpectedDate('');
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

              {q.deposit_expected_date && !q.deposit_paid && (
                <div className="quotes-tab__payments">
                  <span className="quotes-tab__pay-tag quotes-tab__pay-tag--pending">
                    ⏳ Deposit pending — expected {formatDate(q.deposit_expected_date)}
                  </span>
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
                <button
                  className="quotes-tab__action quotes-tab__action--edit"
                  onClick={() => navigate(`/admin/leads/${leadId}/quote/${q.id}`)}
                >
                  <FiEdit2 /> Edit
                </button>
                <button
                  className="quotes-tab__action quotes-tab__action--copy"
                  onClick={() => copyQuote(q)}
                  disabled={copyState[q.id] === 'copying'}
                >
                  <FiCopy /> {copyState[q.id] === 'copying' ? 'Copying…' : 'Copy'}
                </button>
                {q.status === 'draft' && (
                  <button className="quotes-tab__action" onClick={() => updateQuoteStatus(q.id, 'sent')}>Mark Sent</button>
                )}
                {q.status === 'sent' && (
                  <>
                    <button className="quotes-tab__action quotes-tab__action--accept" onClick={() => updateQuoteStatus(q.id, 'accepted')}>Accept</button>
                    <button className="quotes-tab__action quotes-tab__action--reject" onClick={() => updateQuoteStatus(q.id, 'rejected')}>Reject</button>
                  </>
                )}
                {q.status !== 'draft' && q.status !== 'rejected' && (
                  <button
                    className="quotes-tab__action quotes-tab__action--invoice"
                    onClick={() => setInvoiceQuote(q)}
                  >
                    <FiFileText /> Generate Invoice
                  </button>
                )}
                {q.status !== 'draft' && q.status !== 'rejected' && !q.deposit_paid && (
                  <>
                    <button
                      className="quotes-tab__action quotes-tab__action--pending"
                      onClick={() => openPending(q)}
                    >
                      <FiClock /> {q.deposit_expected_date ? 'Update Pending Date' : 'Pending Deposit'}
                    </button>
                    <button
                      className="quotes-tab__action quotes-tab__action--paid"
                      onClick={() => markPaid(q, 'deposit')}
                      disabled={paidState[q.id] === 'saving'}
                    >
                      <FiCheckCircle /> {paidState[q.id] === 'saving' ? 'Saving…' : 'Mark Deposit Paid'}
                    </button>
                  </>
                )}
                {q.deposit_paid && !q.balance_paid && (
                  <>
                    <button
                      className="quotes-tab__action quotes-tab__action--balance"
                      onClick={() => requestBalance(q)}
                      disabled={balanceState[q.id] === 'sending'}
                    >
                      <FiSend /> {balanceLabel(q.id)}
                    </button>
                    <button
                      className="quotes-tab__action quotes-tab__action--paid"
                      onClick={() => markPaid(q, 'balance')}
                      disabled={paidState[q.id] === 'saving'}
                    >
                      <FiCheckCircle /> {paidState[q.id] === 'saving' ? 'Saving…' : 'Mark Balance Paid'}
                    </button>
                  </>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}

      {pendingQuote && (
        <ModalShell title="Pending Deposit" onClose={() => setPendingQuote(null)}>
          <p className="quotes-tab__pending-prompt">
            When is the customer expected to pay the deposit for{' '}
            <strong>{pendingQuote.quote_number}</strong>?
          </p>
          <label className="quotes-tab__pending-label" htmlFor="deposit-expected-date">
            Predicted payment date
          </label>
          <input
            id="deposit-expected-date"
            type="date"
            className="modal-field__input"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
            autoFocus
          />
          <div className="modal-actions">
            <button
              type="button"
              className="modal-actions__btn modal-actions__btn--cancel"
              onClick={() => setPendingQuote(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="quotes-tab__pending-save"
              disabled={!expectedDate || savingPending}
              onClick={savePending}
            >
              {savingPending ? 'Saving…' : 'Set as Pending'}
            </button>
          </div>
        </ModalShell>
      )}

      {invoiceQuote && (
        <InvoiceModal
          quote={invoiceQuote}
          leadId={leadId}
          onClose={() => setInvoiceQuote(null)}
        />
      )}
    </div>
  );
}
