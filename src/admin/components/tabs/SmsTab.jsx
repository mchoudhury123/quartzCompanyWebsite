import useSms from '../../hooks/useSms';
import { FiMessageSquare, FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';
import './SmsTab.css';

export default function SmsTab({ leadId, onSendSms }) {
  const { messages, loading } = useSms(leadId);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  if (loading) return <div className="sms-tab__loading">Loading messages...</div>;

  return (
    <div className="sms-tab">
      <div className="sms-tab__header">
        <h3 className="sms-tab__title">SMS ({messages.length})</h3>
        <button className="sms-tab__add" onClick={onSendSms}>
          <FiMessageSquare /> Send SMS
        </button>
      </div>
      {messages.length === 0 ? (
        <p className="sms-tab__empty">No SMS messages yet.</p>
      ) : (
        <div className="sms-tab__list">
          {messages.map((m) => {
            const DirIcon = m.direction === 'inbound' ? FiArrowDownLeft : FiArrowUpRight;
            return (
              <div className="sms-tab__item" key={m.id}>
                <DirIcon className={`sms-tab__item-icon sms-tab__item-icon--${m.direction}`} />
                <div className="sms-tab__item-info">
                  <div className="sms-tab__item-top">
                    <span className="sms-tab__item-direction">
                      {m.direction === 'inbound' ? 'Received' : 'Sent'}
                    </span>
                    {m.status && (
                      <span className={`sms-tab__status sms-tab__status--${m.status}`}>
                        {m.status}
                      </span>
                    )}
                  </div>
                  <p className="sms-tab__item-body">{m.body}</p>
                  <span className="sms-tab__item-meta">
                    {m.sent_by} · {formatDate(m.created_at)}
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
