import { useSearchParams } from 'react-router-dom';
import useActivities from '../../hooks/useActivities';
import {
  FiRefreshCw, FiMessageSquare, FiFileText, FiPackage,
  FiPhone, FiPaperclip, FiEdit, FiPlusCircle, FiArrowRight, FiExternalLink,
} from 'react-icons/fi';
import './ActivityTab.css';

const ICON_MAP = {
  status_change: FiArrowRight,
  note_added: FiMessageSquare,
  quote_created: FiFileText,
  quote_updated: FiFileText,
  order_created: FiPlusCircle,
  order_updated: FiEdit,
  sample_requested: FiPackage,
  sample_sent: FiPackage,
  sample_delivered: FiPackage,
  file_uploaded: FiPaperclip,
  file_deleted: FiPaperclip,
  call_logged: FiPhone,
  sms_sent: FiMessageSquare,
  email_sent: FiMessageSquare,
  lead_created: FiPlusCircle,
  lead_updated: FiEdit,
};

/* Maps activity_type → { tab, idKey } so we can link to the right tab and highlight the item */
const LINK_MAP = {
  sms_sent: { tab: 'sms', idKey: 'sms_id' },
  call_logged: { tab: 'calls', idKey: 'call_id' },
  sample_requested: { tab: 'samples', idKey: 'sample_id' },
  sample_sent: { tab: 'samples', idKey: 'sample_id' },
  sample_delivered: { tab: 'samples', idKey: 'sample_id' },
  quote_created: { tab: 'quotes', idKey: 'quote_id' },
  quote_updated: { tab: 'quotes', idKey: 'quote_id' },
  file_uploaded: { tab: 'files', idKey: 'file_id' },
};

export default function ActivityTab({ leadId }) {
  const { activities, loading, refetch } = useActivities(leadId);
  const [, setParams] = useSearchParams();

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const handleClick = (activity) => {
    const link = LINK_MAP[activity.activity_type];
    if (!link) return;
    const targetId = activity.metadata?.[link.idKey];
    if (!targetId) return;
    setParams({ tab: link.tab, highlight: targetId }, { replace: true });
  };

  if (loading) return <div className="activity-tab__loading">Loading activity...</div>;

  return (
    <div className="activity-tab">
      <div className="activity-tab__header">
        <h3 className="activity-tab__title">Activity Timeline</h3>
        <button className="activity-tab__refresh" onClick={refetch}><FiRefreshCw /></button>
      </div>
      {activities.length === 0 ? (
        <p className="activity-tab__empty">No activity recorded yet.</p>
      ) : (
        <div className="activity-tab__timeline">
          {activities.map((a) => {
            const Icon = ICON_MAP[a.activity_type] || FiEdit;
            const link = LINK_MAP[a.activity_type];
            const isClickable = link && a.metadata?.[link.idKey];
            return (
              <div
                className={`activity-tab__item${isClickable ? ' activity-tab__item--clickable' : ''}`}
                key={a.id}
                onClick={isClickable ? () => handleClick(a) : undefined}
              >
                <div className="activity-tab__dot">
                  <Icon />
                </div>
                <div className="activity-tab__body">
                  <div className="activity-tab__item-header">
                    <span className="activity-tab__item-title">
                      {a.title}
                      {isClickable && <FiExternalLink className="activity-tab__link-icon" />}
                    </span>
                    <span className="activity-tab__item-date">{formatDate(a.created_at)}</span>
                  </div>
                  {a.description && <p className="activity-tab__item-desc">{a.description}</p>}
                  <span className="activity-tab__item-author">{a.author}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
