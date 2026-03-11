import { useEffect, useRef } from 'react';
import useEmails from '../../hooks/useEmails';
import { FiMail, FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';
import './EmailsTab.css';

export default function EmailsTab({ leadId, onSendEmail, highlightId }) {
  const { emails, loading } = useEmails(leadId);
  const highlightRef = useRef(null);

  useEffect(() => {
    if (highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightId, loading]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  if (loading) return <div className="emails-tab__loading">Loading emails...</div>;

  return (
    <div className="emails-tab">
      <div className="emails-tab__header">
        <h3 className="emails-tab__title">Emails ({emails.length})</h3>
        <button className="emails-tab__add" onClick={onSendEmail}>
          <FiMail /> Send Email
        </button>
      </div>
      {emails.length === 0 ? (
        <p className="emails-tab__empty">No emails yet.</p>
      ) : (
        <div className="emails-tab__list">
          {emails.map((e) => {
            const DirIcon = e.direction === 'inbound' ? FiArrowDownLeft : FiArrowUpRight;
            const isHighlighted = highlightId === e.id;
            return (
              <div
                className={`emails-tab__item${isHighlighted ? ' tab-item--highlight' : ''}`}
                key={e.id}
                ref={isHighlighted ? highlightRef : null}
              >
                <DirIcon className={`emails-tab__item-icon emails-tab__item-icon--${e.direction}`} />
                <div className="emails-tab__item-info">
                  <div className="emails-tab__item-top">
                    <span className="emails-tab__item-direction">
                      {e.direction === 'inbound' ? 'Received' : 'Sent'}
                    </span>
                    {e.status && (
                      <span className={`emails-tab__status emails-tab__status--${e.status}`}>
                        {e.status}
                      </span>
                    )}
                  </div>
                  <p className="emails-tab__item-subject">{e.subject}</p>
                  <p className="emails-tab__item-body">{e.body}</p>
                  <span className="emails-tab__item-meta">
                    {e.sent_by} · {e.to_address} · {formatDate(e.created_at)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
