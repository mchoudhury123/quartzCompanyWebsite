import useCalls from '../../hooks/useCalls';
import { FiPhone, FiPhoneIncoming, FiPhoneOutgoing } from 'react-icons/fi';
import './CallsTab.css';

export default function CallsTab({ leadId, onLogCall }) {
  const { calls, loading } = useCalls(leadId);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const formatDuration = (s) => {
    if (!s) return '—';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  if (loading) return <div className="calls-tab__loading">Loading calls...</div>;

  return (
    <div className="calls-tab">
      <div className="calls-tab__header">
        <h3 className="calls-tab__title">Calls ({calls.length})</h3>
        <button className="calls-tab__add" onClick={onLogCall}>
          <FiPhone /> Log Call
        </button>
      </div>
      {calls.length === 0 ? (
        <p className="calls-tab__empty">No calls logged yet.</p>
      ) : (
        <div className="calls-tab__list">
          {calls.map((c) => {
            const DirIcon = c.direction === 'inbound' ? FiPhoneIncoming : FiPhoneOutgoing;
            return (
              <div className="calls-tab__item" key={c.id}>
                <DirIcon className={`calls-tab__item-icon calls-tab__item-icon--${c.direction}`} />
                <div className="calls-tab__item-info">
                  <div className="calls-tab__item-top">
                    <span className="calls-tab__item-direction">
                      {c.direction === 'inbound' ? 'Inbound' : 'Outbound'}
                    </span>
                    {c.outcome && (
                      <span className={`calls-tab__outcome calls-tab__outcome--${c.outcome}`}>
                        {c.outcome.replace(/_/g, ' ')}
                      </span>
                    )}
                    <span className="calls-tab__item-duration">{formatDuration(c.duration_seconds)}</span>
                  </div>
                  {c.summary && <p className="calls-tab__item-summary">{c.summary}</p>}
                  <span className="calls-tab__item-meta">
                    {c.called_by} · {formatDate(c.called_at)}
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
