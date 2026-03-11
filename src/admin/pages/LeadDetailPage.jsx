import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useLeadDetail from '../hooks/useLeadDetail';
import ClientInfoPanel from '../components/ClientInfoPanel';
import ClientDetailTabs from '../components/ClientDetailTabs';
import NewTaskDropdown from '../components/NewTaskDropdown';
import ActivityTab from '../components/tabs/ActivityTab';
import QuotesTab from '../components/tabs/QuotesTab';
import OrdersTab from '../components/tabs/OrdersTab';
import SamplesTab from '../components/tabs/SamplesTab';
import FilesTab from '../components/tabs/FilesTab';
import CallsTab from '../components/tabs/CallsTab';
import SampleCreateModal from '../components/modals/SampleCreateModal';
import CallLogModal from '../components/modals/CallLogModal';
import FileUploadModal from '../components/modals/FileUploadModal';
import { FiArrowLeft } from 'react-icons/fi';
import './LeadDetailPage.css';

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lead, loading, updateStatus, updateLeadField } = useLeadDetail(id);
  const [modal, setModal] = useState(null);

  const handleNewTask = (key) => {
    switch (key) {
      case 'sms':
        alert('SMS integration coming soon. You can call or email the client directly.');
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
    }
  };

  if (loading) return <div className="admin-page-loading">Loading client...</div>;
  if (!lead) return <div className="admin-page-loading">Client not found.</div>;

  const renderTab = (activeTab) => {
    switch (activeTab) {
      case 'activity': return <ActivityTab leadId={id} />;
      case 'quotes': return <QuotesTab leadId={id} onCreateQuote={() => navigate(`/admin/leads/${id}/quote/new`)} />;
      case 'orders': return <OrdersTab leadId={id} />;
      case 'samples': return <SamplesTab leadId={id} onCreateSample={() => setModal('sample')} />;
      case 'files': return <FilesTab leadId={id} onUploadFile={() => setModal('file')} />;
      case 'calls': return <CallsTab leadId={id} onLogCall={() => setModal('call')} />;
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
          />
        </div>
        <div className="lead-detail__right">
          <ClientDetailTabs>
            {renderTab}
          </ClientDetailTabs>
        </div>
      </div>

      {modal === 'sample' && <SampleCreateModal leadId={id} onClose={() => setModal(null)} />}
      {modal === 'call' && <CallLogModal leadId={id} onClose={() => setModal(null)} />}
      {modal === 'file' && <FileUploadModal leadId={id} onClose={() => setModal(null)} />}
    </div>
  );
}
