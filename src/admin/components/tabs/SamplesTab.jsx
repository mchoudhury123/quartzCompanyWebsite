import { useEffect, useRef } from 'react';
import useSamples from '../../hooks/useSamples';
import { FiPlus, FiPackage } from 'react-icons/fi';
import './SamplesTab.css';

const SAMPLE_STATUSES = ['requested', 'preparing', 'sent', 'delivered', 'returned'];

export default function SamplesTab({ leadId, onCreateSample, highlightId }) {
  const { samples, loading, updateSampleStatus } = useSamples(leadId);
  const highlightRef = useRef(null);

  useEffect(() => {
    if (highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightId, loading]);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }) : '—';

  if (loading) return <div className="samples-tab__loading">Loading samples...</div>;

  return (
    <div className="samples-tab">
      <div className="samples-tab__header">
        <h3 className="samples-tab__title">Samples ({samples.length})</h3>
        <button className="samples-tab__add" onClick={onCreateSample}>
          <FiPlus /> New Sample
        </button>
      </div>
      {samples.length === 0 ? (
        <p className="samples-tab__empty">No samples requested yet.</p>
      ) : (
        <div className="samples-tab__list">
          {samples.map((s) => {
            const isHighlighted = highlightId === s.id;
            return (
            <div
              className={`samples-tab__card${isHighlighted ? ' tab-item--highlight' : ''}`}
              key={s.id}
              ref={isHighlighted ? highlightRef : null}
            >
              <div className="samples-tab__card-top">
                <div className="samples-tab__card-left">
                  <FiPackage className="samples-tab__card-icon" />
                  <div>
                    <span className="samples-tab__card-name">{s.product_name}</span>
                    <span className="samples-tab__card-detail">
                      {[s.colour, s.material].filter(Boolean).join(' · ') || '—'}
                    </span>
                  </div>
                </div>
                <span className={`samples-tab__status samples-tab__status--${s.status}`}>
                  {s.status}
                </span>
              </div>
              <div className="samples-tab__card-meta">
                <span>Requested: {formatDate(s.requested_at)}</span>
                {s.sent_at && <span>Sent: {formatDate(s.sent_at)}</span>}
                {s.delivered_at && <span>Delivered: {formatDate(s.delivered_at)}</span>}
                {s.tracking_number && <span>Tracking: {s.tracking_number}</span>}
              </div>
              {s.notes && <p className="samples-tab__card-notes">{s.notes}</p>}
              <div className="samples-tab__card-actions">
                <select
                  className="samples-tab__status-select"
                  value={s.status}
                  onChange={(e) => updateSampleStatus(s.id, e.target.value)}
                >
                  {SAMPLE_STATUSES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
