import { FiPhone, FiPhoneOff, FiMic, FiMicOff } from 'react-icons/fi';
import './TwilioCallBar.css';

export default function TwilioCallBar({ callState, callDuration, isMuted, onHangUp, onToggleMute, leadName }) {
  if (callState === 'idle') return null;

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className={`twilio-bar twilio-bar--${callState}`}>
      <div className="twilio-bar__status">
        {(callState === 'connecting' || callState === 'ringing') && (
          <span className="twilio-bar__pulse" />
        )}
        {callState === 'connecting' && <span>Connecting...</span>}
        {callState === 'ringing' && <span>Ringing {leadName}...</span>}
        {callState === 'in-progress' && (
          <>
            <FiPhone className="twilio-bar__icon" />
            <span>In call with {leadName}</span>
          </>
        )}
        {callState === 'disconnected' && (
          <>
            <FiPhoneOff className="twilio-bar__icon" />
            <span>Call ended</span>
          </>
        )}
      </div>

      <div className="twilio-bar__controls">
        {callState === 'in-progress' && (
          <>
            <span className="twilio-bar__timer">{formatTimer(callDuration)}</span>
            <button
              className={`twilio-bar__btn twilio-bar__btn--mute${isMuted ? ' twilio-bar__btn--active' : ''}`}
              onClick={onToggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <FiMicOff /> : <FiMic />}
            </button>
          </>
        )}
        {(callState === 'connecting' || callState === 'ringing' || callState === 'in-progress') && (
          <button className="twilio-bar__btn twilio-bar__btn--hangup" onClick={onHangUp}>
            <FiPhoneOff /> End
          </button>
        )}
      </div>
    </div>
  );
}
