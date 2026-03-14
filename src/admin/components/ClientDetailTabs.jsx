import { useSearchParams } from 'react-router-dom';
import './ClientDetailTabs.css';

const TABS = [
  { key: 'activity', label: 'Activity' },
  { key: 'quotes', label: 'Quotes' },
  { key: 'orders', label: 'Orders' },
  { key: 'samples', label: 'Samples' },
  { key: 'files', label: 'Files' },
  { key: 'calls', label: 'Calls' },
  { key: 'sms', label: 'SMS' },
  { key: 'emails', label: 'Emails' },
  { key: 'notes', label: 'Notes' },
];

export default function ClientDetailTabs({ children, highlights = {} }) {
  const [params, setParams] = useSearchParams();
  const activeTab = params.get('tab') || 'activity';

  const switchTab = (key) => {
    setParams({ tab: key }, { replace: true });
  };

  return (
    <div className="client-tabs">
      <div className="client-tabs__bar">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`client-tabs__tab${activeTab === tab.key ? ' client-tabs__tab--active' : ''}${highlights[tab.key] ? ' client-tabs__tab--has-content' : ''}`}
            onClick={() => switchTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="client-tabs__content">
        {typeof children === 'function' ? children(activeTab) : children}
      </div>
    </div>
  );
}
