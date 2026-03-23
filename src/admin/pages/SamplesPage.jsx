import { useState } from 'react';
import useAllSamples from '../hooks/useAllSamples';
import StatusBadge from '../components/StatusBadge';
import { FiArrowLeft, FiPackage, FiMessageCircle, FiPhone, FiMail, FiMapPin, FiUser, FiCheckCircle } from 'react-icons/fi';
import './SamplesPage.css';

const STATUS_OPTIONS = ['preparing', 'sent', 'delivered'];

export default function SamplesPage() {
  const { preparingGroups, completedGroups, loading, updateStatus, confirmAll } = useAllSamples();
  const [confirming, setConfirming] = useState(false);
  const [activeTab, setActiveTab] = useState('preparing');
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [fabricatorNumber, setFabricatorNumber] = useState(
    () => localStorage.getItem('fabricator_whatsapp') || ''
  );

  const saveFabricatorNumber = (num) => {
    setFabricatorNumber(num);
    localStorage.setItem('fabricator_whatsapp', num);
  };

  const buildWhatsAppUrl = (lead, samples) => {
    const sampleNames = samples.map((s) => s.product_name).join(', ');
    const message =
      `Hi, I need the following samples prepared for a customer:\n\n` +
      `Customer: ${lead.full_name}\n` +
      `Address: ${lead.address || 'Not provided'}\n` +
      `Phone: ${lead.phone || 'N/A'}\n\n` +
      `Samples needed:\n${samples.map((s) => `- ${s.product_name}${s.colour ? ` (${s.colour})` : ''}`).join('\n')}\n\n` +
      `Please confirm when ready. Thank you.`;
    const cleanNum = fabricatorNumber.replace(/[^0-9+]/g, '');
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`;
  };

  if (loading) return <div className="admin-page-loading">Loading samples...</div>;

  const groups = activeTab === 'preparing' ? preparingGroups : completedGroups;
  const groupEntries = Object.entries(groups);

  // Detail view
  const allGroups = { ...preparingGroups, ...completedGroups };
  const selectedGroup = selectedLeadId ? allGroups[selectedLeadId] : null;

  if (selectedGroup) {
    const { lead, samples } = selectedGroup;
    return (
      <div className="samples-page">
        <button className="samples-page__back" onClick={() => setSelectedLeadId(null)}>
          <FiArrowLeft /> Back to Samples
        </button>

        <div className="samples-page__detail-card">
          <h2 className="samples-page__detail-name">
            <FiUser className="samples-page__detail-icon" />
            {lead.full_name}
          </h2>
          <div className="samples-page__detail-info">
            {lead.address && (
              <div className="samples-page__detail-row">
                <FiMapPin /> <span>{lead.address}</span>
              </div>
            )}
            {lead.phone && (
              <div className="samples-page__detail-row">
                <FiPhone /> <span>{lead.phone}</span>
              </div>
            )}
            {lead.email && (
              <div className="samples-page__detail-row">
                <FiMail /> <span>{lead.email}</span>
              </div>
            )}
          </div>
        </div>

        <div className="samples-page__detail-samples">
          <h3 className="samples-page__section-title">Samples ({samples.length})</h3>
          {samples.map((s) => (
            <div className="samples-page__sample-row" key={s.id}>
              <div className="samples-page__sample-info">
                <FiPackage className="samples-page__sample-icon" />
                <div>
                  <span className="samples-page__sample-name">{s.product_name}</span>
                  {s.colour && <span className="samples-page__sample-detail">{s.colour}{s.material ? ` \u00B7 ${s.material}` : ''}</span>}
                </div>
              </div>
              <StatusBadge status={s.status} label={s.status} />
            </div>
          ))}
        </div>

        {samples.some((s) => s.status === 'preparing') && (
          <div className="samples-page__confirm-all">
            <button
              className={`samples-page__confirm-btn${confirming ? ' samples-page__confirm-btn--loading' : ''}`}
              disabled={confirming}
              onClick={async () => {
                setConfirming(true);
                await confirmAll(lead.id, lead, samples);
                setConfirming(false);
                setSelectedLeadId(null);
              }}
            >
              <FiCheckCircle />
              {confirming ? 'Processing...' : 'Confirm All Samples & Notify Customer'}
            </button>
            <p className="samples-page__confirm-hint">
              Marks all samples as sent and emails the customer that their samples are on the way (3\u20135 days).
            </p>
          </div>
        )}

        <div className="samples-page__fabricator">
          <h3 className="samples-page__section-title">Message Fabricator</h3>
          <div className="samples-page__fabricator-row">
            <input
              className="samples-page__fabricator-input"
              type="tel"
              placeholder="Fabricator WhatsApp number (e.g. +447...)"
              value={fabricatorNumber}
              onChange={(e) => saveFabricatorNumber(e.target.value)}
            />
            <a
              className={`samples-page__fabricator-btn${!fabricatorNumber ? ' samples-page__fabricator-btn--disabled' : ''}`}
              href={fabricatorNumber ? buildWhatsAppUrl(lead, samples) : undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { if (!fabricatorNumber) e.preventDefault(); }}
            >
              <FiMessageCircle /> Message Fabricator
            </a>
          </div>
          {!fabricatorNumber && (
            <p className="samples-page__fabricator-hint">Enter the fabricator's WhatsApp number to enable messaging.</p>
          )}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="samples-page">
      <div className="samples-page__header">
        <h1 className="samples-page__title">Samples</h1>
      </div>

      <div className="samples-page__tabs">
        <button
          className={`samples-page__tab${activeTab === 'preparing' ? ' samples-page__tab--active' : ''}`}
          onClick={() => setActiveTab('preparing')}
        >
          Preparing ({Object.keys(preparingGroups).length})
        </button>
        <button
          className={`samples-page__tab${activeTab === 'completed' ? ' samples-page__tab--active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({Object.keys(completedGroups).length})
        </button>
      </div>

      {groupEntries.length === 0 ? (
        <div className="samples-page__empty">
          <FiPackage className="samples-page__empty-icon" />
          <p>No {activeTab === 'preparing' ? 'samples being prepared' : 'completed samples'} yet.</p>
        </div>
      ) : (
        <div className="samples-page__list">
          {groupEntries.map(([leadId, group]) => (
            <div className="samples-page__group" key={leadId}>
              <div className="samples-page__group-header">
                <div className="samples-page__group-left">
                  <button
                    className="samples-page__group-name"
                    onClick={() => setSelectedLeadId(leadId)}
                  >
                    {group.lead.full_name}
                  </button>
                  {group.lead.phone && (
                    <span className="samples-page__group-phone">
                      <FiPhone /> {group.lead.phone}
                    </span>
                  )}
                </div>
                <span className="samples-page__group-count">{group.samples.length} sample{group.samples.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="samples-page__group-samples">
                {group.samples.map((s) => (
                  <div className="samples-page__group-sample" key={s.id}>
                    <FiPackage className="samples-page__group-sample-icon" />
                    <span>{s.product_name}</span>
                    <StatusBadge status={s.status} label={s.status} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
