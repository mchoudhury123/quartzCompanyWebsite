import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import useLeadDetail from '../hooks/useLeadDetail';
import useTwilioDevice from '../hooks/useTwilioDevice';
import ClientInfoPanel from '../components/ClientInfoPanel';
import ClientDetailTabs from '../components/ClientDetailTabs';
import NewTaskDropdown from '../components/NewTaskDropdown';
import TwilioCallBar from '../components/TwilioCallBar';
import ActivityTab from '../components/tabs/ActivityTab';
import QuotesTab from '../components/tabs/QuotesTab';
import OrdersTab from '../components/tabs/OrdersTab';
import SamplesTab from '../components/tabs/SamplesTab';
import FilesTab from '../components/tabs/FilesTab';
import CallsTab from '../components/tabs/CallsTab';
import SmsTab from '../components/tabs/SmsTab';
import EmailsTab from '../components/tabs/EmailsTab';
import NotesTab from '../components/tabs/NotesTab';
import SampleCreateModal from '../components/modals/SampleCreateModal';
import FileUploadModal from '../components/modals/FileUploadModal';
import SmsModal from '../components/modals/SmsModal';
import EmailModal from '../components/modals/EmailModal';
import ActionOutcomeModal from '../components/modals/ActionOutcomeModal';
import ActionBar from '../components/ActionBar';
import RetryBar from '../components/RetryBar';
import { FiArrowLeft } from 'react-icons/fi';
import './LeadDetailPage.css';

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight') || null;
  const { lead, notes, loading, updateStatus, updateLeadField, addNote, deleteNote, completeAction, retryCall } = useLeadDetail(id);
  const [modal, setModal] = useState(null);
  const [tabHighlights, setTabHighlights] = useState({});
  const twilio = useTwilioDevice();

  useEffect(() => {
    async function fetchTabCounts() {
      const [{ count: sc }, { count: fc }] = await Promise.all([
        supabase.from('lead_samples').select('*', { count: 'exact', head: true }).eq('lead_id', id),
        supabase.from('lead_files').select('*', { count: 'exact', head: true }).eq('lead_id', id),
      ]);
      setTabHighlights({ samples: sc > 0, files: fc > 0 });
    }
    fetchTabCounts();
  }, [id]);

  useEffect(() => {
    twilio.initDevice();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCallClick = (phone) => {
    if (!phone) return;
    twilio.makeCall(phone, id);
  };

  const handleNewTask = (key) => {
    switch (key) {
      case 'sms':
        setModal('sms');
        break;
      case 'email':
        setModal('email');
        break;
      case 'call':
        handleCallClick(lead?.phone);
        break;
      case 'sample':
        setModal('sample');
        break;
      case 'quote':
        navigate(`/admin/leads/${id}/quote/new`);
        break;
      case 'file':
        setModal('file');
        break;
      case 'appointment':
        navigate('/admin/appointments', {
          state: {
            prefill: {
              customer_name: lead?.full_name || '',
              customer_phone: lead?.phone || '',
              lead_id: lead?.id || null,
              location: lead?.address || '',
            },
          },
        });
        break;
    }
  };

  if (loading) return <div className="admin-page-loading">Loading client...</div>;
  if (!lead) return <div className="admin-page-loading">Client not found.</div>;

  const renderTab = (activeTab) => {
    switch (activeTab) {
      case 'activity': return <ActivityTab leadId={id} />;
      case 'quotes': return <QuotesTab leadId={id} onCreateQuote={() => navigate(`/admin/leads/${id}/quote/new`)} />;
      case 'orders': return <OrdersTab leadId={id} />;
      case 'samples': return <SamplesTab leadId={id} onCreateSample={() => setModal('sample')} highlightId={highlightId} />;
      case 'files': return <FilesTab leadId={id} onUploadFile={() => setModal('file')} />;
      case 'calls': return <CallsTab leadId={id} highlightId={highlightId} />;
      case 'sms': return <SmsTab leadId={id} onSendSms={() => setModal('sms')} highlightId={highlightId} />;
      case 'emails': return <EmailsTab leadId={id} onSendEmail={() => setModal('email')} highlightId={highlightId} />;
      case 'notes': return <NotesTab notes={notes} onAddNote={addNote} onDeleteNote={deleteNote} highlightId={highlightId} />;
      default: return <ActivityTab leadId={id} />;
    }
  };

  return (
    <div className="lead-detail">
      <div className="lead-detail__topbar">
        <Link to="/admin/leads" className="lead-detail__back">
          <FiArrowLeft /> Back to Clients
        </Link>
        <div className="lead-detail__topbar-actions">
          <NewTaskDropdown onSelect={handleNewTask} />
        </div>
      </div>

      <div className="lead-detail__layout">
        <div className="lead-detail__left">
          <ClientInfoPanel
            lead={lead}
            onStatusChange={updateStatus}
            onFieldUpdate={updateLeadField}
            onCallClick={handleCallClick}
            onSmsClick={() => setModal('sms')}
            onEmailClick={() => setModal('email')}
          />
        </div>
        <div className="lead-detail__right">
          {lead.pending_action && (
            <ActionBar action={lead.pending_action} onComplete={() => setModal('action_outcome')} />
          )}
          {lead.status === 'new' && !lead.pending_action && (
            <RetryBar onAnswered={retryCall} />
          )}
          <TwilioCallBar
            callState={twilio.callState}
            callDuration={twilio.callDuration}
            isMuted={twilio.isMuted}
            onHangUp={twilio.hangUp}
            onToggleMute={twilio.toggleMute}
            leadName={lead.full_name}
          />
          <ClientDetailTabs highlights={tabHighlights}>
            {renderTab}
          </ClientDetailTabs>
        </div>
      </div>

      {modal === 'sample' && <SampleCreateModal leadId={id} onClose={() => setModal(null)} />}
      {modal === 'file' && <FileUploadModal leadId={id} onClose={() => setModal(null)} />}
      {modal === 'sms' && (
        <SmsModal
          leadId={id}
          leadPhone={lead.phone}
          leadName={lead.full_name}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'email' && (
        <EmailModal
          leadId={id}
          leadEmail={lead.email}
          leadName={lead.full_name}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'action_outcome' && (
        <ActionOutcomeModal
          action={lead.pending_action}
          onComplete={completeAction}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
