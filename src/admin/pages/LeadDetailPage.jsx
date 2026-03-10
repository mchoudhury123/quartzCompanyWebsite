import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useLeadDetail from '../hooks/useLeadDetail';
import StatusSelect from '../components/StatusSelect';
import StatusBadge from '../components/StatusBadge';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import './LeadDetailPage.css';

export default function LeadDetailPage() {
  const { id } = useParams();
  const { lead, notes, loading, updateStatus, addNote } = useLeadDetail(id);
  const [noteText, setNoteText] = useState('');
  const [noteSending, setNoteSending] = useState(false);

  if (loading) return <div className="admin-page-loading">Loading lead...</div>;
  if (!lead) return <div className="admin-page-loading">Lead not found.</div>;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const handleStatusChange = async (newStatus) => {
    await updateStatus(newStatus);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setNoteSending(true);
    await addNote(noteText.trim());
    setNoteText('');
    setNoteSending(false);
  };

  const InfoRow = ({ label, value }) => {
    if (!value) return null;
    return (
      <div className="lead-detail__row">
        <span className="lead-detail__label">{label}</span>
        <span className="lead-detail__value">{value}</span>
      </div>
    );
  };

  return (
    <div className="lead-detail">
      <Link to="/admin/leads" className="lead-detail__back">
        <FiArrowLeft /> Back to Leads
      </Link>

      <div className="lead-detail__grid">
        {/* Left: Lead Information */}
        <div className="lead-detail__card">
          <div className="lead-detail__card-header">
            <h2 className="lead-detail__name">{lead.full_name}</h2>
            <StatusBadge status={lead.status} />
          </div>

          <div className="lead-detail__section">
            <h3 className="lead-detail__section-title">Contact Information</h3>
            <InfoRow label="Email" value={lead.email} />
            <InfoRow label="Phone" value={lead.phone} />
            <InfoRow label="Postcode" value={lead.postcode} />
          </div>

          {lead.source === 'quote_modal' && (
            <div className="lead-detail__section">
              <h3 className="lead-detail__section-title">Quote Details</h3>
              <InfoRow label="Product" value={lead.product_name} />
              <InfoRow label="Material" value={lead.product_material} />
              <InfoRow label="Run Length" value={lead.run_length_mm ? `${lead.run_length_mm}mm` : null} />
              <InfoRow label="Depth" value={lead.depth_mm ? `${lead.depth_mm}mm` : null} />
              <InfoRow label="Thickness" value={lead.thickness} />
              {lead.cut_outs && (lead.cut_outs.hob || lead.cut_outs.sink || lead.cut_outs.tap) && (
                <InfoRow label="Cut-outs" value={`Hob: ${lead.cut_outs.hob || 0}, Sink: ${lead.cut_outs.sink || 0}, Tap: ${lead.cut_outs.tap || 0}`} />
              )}
              <InfoRow label="Samples" value={lead.want_samples ? 'Yes' : 'No'} />
              <InfoRow label="Callback" value={lead.want_callback ? `Yes (${lead.callback_time || 'No preference'})` : 'No'} />
            </div>
          )}

          {lead.source === 'contact_form' && lead.subject && (
            <div className="lead-detail__section">
              <h3 className="lead-detail__section-title">Message</h3>
              <InfoRow label="Subject" value={lead.subject} />
              {lead.message && <p className="lead-detail__message">{lead.message}</p>}
            </div>
          )}

          {lead.comments && (
            <div className="lead-detail__section">
              <h3 className="lead-detail__section-title">Comments</h3>
              <p className="lead-detail__message">{lead.comments}</p>
            </div>
          )}

          <div className="lead-detail__section">
            <InfoRow label="Source" value={lead.source === 'quote_modal' ? 'Quote Form' : 'Contact Form'} />
            <InfoRow label="Created" value={formatDate(lead.created_at)} />
            {lead.updated_at !== lead.created_at && (
              <InfoRow label="Updated" value={formatDate(lead.updated_at)} />
            )}
          </div>
        </div>

        {/* Right: Status & Notes */}
        <div className="lead-detail__sidebar">
          <div className="lead-detail__card">
            <h3 className="lead-detail__section-title">Update Status</h3>
            <StatusSelect value={lead.status} onChange={handleStatusChange} />
          </div>

          <div className="lead-detail__card lead-detail__notes-card">
            <h3 className="lead-detail__section-title">Notes ({notes.length})</h3>
            <div className="lead-detail__notes">
              {notes.length === 0 && (
                <p className="lead-detail__notes-empty">No notes yet. Add a follow-up note below.</p>
              )}
              {notes.map((note) => (
                <div className="lead-detail__note" key={note.id}>
                  <div className="lead-detail__note-header">
                    <span className="lead-detail__note-author">{note.author}</span>
                    <span className="lead-detail__note-date">{formatDate(note.created_at)}</span>
                  </div>
                  <p className="lead-detail__note-content">{note.content}</p>
                </div>
              ))}
            </div>
            <form className="lead-detail__note-form" onSubmit={handleAddNote}>
              <textarea
                className="lead-detail__note-input"
                placeholder="Add a follow-up note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
              />
              <button className="lead-detail__note-submit" type="submit" disabled={noteSending || !noteText.trim()}>
                <FiSend /> {noteSending ? 'Sending...' : 'Add Note'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
