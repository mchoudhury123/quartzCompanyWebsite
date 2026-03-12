import { FiAlertCircle, FiPhone, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import './ActionBar.css';

const ACTION_CONFIG = {
  call_new: {
    icon: FiPhone,
    label: 'Call this customer about their quote request',
    btnText: 'Mark Complete',
  },
  follow_up: {
    icon: FiPhone,
    label: "Follow-up call \u2014 customer didn\u2019t answer last time",
    btnText: 'Mark Complete',
  },
  chase_measurements: {
    icon: FiMapPin,
    label: 'Call back to get kitchen measurements',
    btnText: 'Mark Complete',
  },
};

export default function ActionBar({ action, onComplete }) {
  const config = ACTION_CONFIG[action];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className="action-bar">
      <div className="action-bar__left">
        <FiAlertCircle className="action-bar__alert-icon" />
        <Icon className="action-bar__type-icon" />
        <span className="action-bar__label">{config.label}</span>
      </div>
      <button className="action-bar__btn" onClick={onComplete}>
        <FiCheckCircle /> {config.btnText}
      </button>
    </div>
  );
}
