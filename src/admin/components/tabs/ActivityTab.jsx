import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useActivities from '../../hooks/useActivities';
import {
  FiRefreshCw, FiMessageSquare, FiFileText, FiPackage,
  FiPhone, FiPaperclip, FiEdit, FiPlusCircle, FiArrowRight, FiExternalLink, FiMail,
  FiClipboard, FiChevronDown, FiChevronUp,
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
  email_sent: FiMail,
  lead_created: FiPlusCircle,
  lead_updated: FiEdit,
  enquiry_received: FiClipboard,
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
  email_sent: { tab: 'emails', idKey: 'email_id' },
  note_added: { tab: 'notes', idKey: 'note_id' },
};

function EnquiryDetail({ metadata }) {
  if (!metadata) return null;
  const m = metadata;

  return (
    <div className="activity-tab__enquiry-detail">
      {m.products?.length > 0 && (
        <div className="activity-tab__enquiry-row">
          <span className="activity-tab__enquiry-label">Interested in</span>
          <span className="activity-tab__enquiry-value">
            {m.products.map((p) => `${p.name}${p.material ? ` (${p.material})` : ''}`).join(', ')}
          </span>
        </div>
      )}
      {m.dimensions && (
        <div className="activity-tab__enquiry-row">
          <span className="activity-tab__enquiry-label">Dimensions</span>
          <span className="activity-tab__enquiry-value">
            {m.dimensions.run_length_mm}mm x {m.dimensions.depth_mm}mm — {m.dimensions.thickness}
          </span>
        </div>
      )}
      {m.kitchen_plan?.worktop_runs?.length > 0 && (
        <div className="activity-tab__enquiry-row">
          <span className="activity-tab__enquiry-label">Worktop runs</span>
          <span className="activity-tab__enquiry-value">
            {m.kitchen_plan.worktop_runs.map((r, i) => `Run ${i + 1}: ${r.length}mm x ${r.width}mm`).join(', ')}
          </span>
        </div>
      )}
      {m.cut_outs && (m.cut_outs.hob > 0 || m.cut_outs.sink > 0 || m.cut_outs.tap > 0) && (
        <div className="activity-tab__enquiry-row">
          <span className="activity-tab__enquiry-label">Cut-outs</span>
          <span className="activity-tab__enquiry-value">
            {[
              m.cut_outs.hob > 0 && `${m.cut_outs.hob} hob`,
              m.cut_outs.sink > 0 && `${m.cut_outs.sink} sink`,
              m.cut_outs.tap > 0 && `${m.cut_outs.tap} tap`,
            ].filter(Boolean).join(', ')}
          </span>
        </div>
      )}
      {m.want_samples != null && (
        <div className="activity-tab__enquiry-row">
          <span className="activity-tab__enquiry-label">Samples</span>
          <span className="activity-tab__enquiry-value">{m.want_samples ? 'Yes' : 'No'}</span>
        </div>
      )}
      {m.want_callback && (
        <div className="activity-tab__enquiry-row">
          <span className="activity-tab__enquiry-label">Callback</span>
          <span className="activity-tab__enquiry-value">{m.callback_time || 'Yes'}</span>
        </div>
      )}
      {m.install_date && (
        <div className="activity-tab__enquiry-row">
          <span className="activity-tab__enquiry-label">Install date</span>
          <span className="activity-tab__enquiry-value">{m.install_date}</span>
        </div>
      )}
      {m.postcode && (
        <div className="activity-tab__enquiry-row">
          <span className="activity-tab__enquiry-label">Postcode</span>
          <span className="activity-tab__enquiry-value">{m.postcode}</span>
        </div>
      )}
      {m.subject && (
        <div className="activity-tab__enquiry-row">
          <span className="activity-tab__enquiry-label">Subject</span>
          <span className="activity-tab__enquiry-value">{m.subject}</span>
        </div>
      )}
      {m.message && (
        <div className="activity-tab__enquiry-row">
          <span className="activity-tab__enquiry-label">Message</span>
          <span className="activity-tab__enquiry-value">{m.message}</span>
        </div>
      )}
      {m.comments && (
        <div className="activity-tab__enquiry-row">
          <span className="activity-tab__enquiry-label">Comments</span>
          <span className="activity-tab__enquiry-value">{m.comments}</span>
        </div>
      )}
    </div>
  );
}

export default function ActivityTab({ leadId }) {
  const { activities, loading, refetch } = useActivities(leadId);
  const [, setParams] = useSearchParams();
  const [expandedEnquiries, setExpandedEnquiries] = useState({});

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const handleClick = (activity) => {
    // Enquiry items toggle expand instead of navigating
    if (activity.activity_type === 'enquiry_received') {
      setExpandedEnquiries((prev) => ({ ...prev, [activity.id]: !prev[activity.id] }));
      return;
    }
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
            const isEnquiry = a.activity_type === 'enquiry_received';
            const isExpanded = expandedEnquiries[a.id];
            return (
              <div
                className={`activity-tab__item${isClickable || isEnquiry ? ' activity-tab__item--clickable' : ''}${isEnquiry ? ' activity-tab__item--enquiry' : ''}`}
                key={a.id}
                onClick={isClickable || isEnquiry ? () => handleClick(a) : undefined}
              >
                <div className={`activity-tab__dot${isEnquiry ? ' activity-tab__dot--enquiry' : ''}`}>
                  <Icon />
                </div>
                <div className="activity-tab__body">
                  <div className="activity-tab__item-header">
                    <span className="activity-tab__item-title">
                      {a.title}
                      {isEnquiry && (isExpanded ? <FiChevronUp className="activity-tab__link-icon" /> : <FiChevronDown className="activity-tab__link-icon" />)}
                      {isClickable && !isEnquiry && <FiExternalLink className="activity-tab__link-icon" />}
                    </span>
                    <span className="activity-tab__item-date">{formatDate(a.created_at)}</span>
                  </div>
                  {a.description && <p className="activity-tab__item-desc">{a.description}</p>}
                  {isEnquiry && isExpanded && <EnquiryDetail metadata={a.metadata} />}
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
