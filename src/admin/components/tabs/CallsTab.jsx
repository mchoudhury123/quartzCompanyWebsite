import { useState, useRef } from 'react';
import useCalls from '../../hooks/useCalls';
import { FiPhone, FiPhoneIncoming, FiPhoneOutgoing, FiPlay, FiPause } from 'react-icons/fi';
import './CallsTab.css';

function RecordingPlayer({ url }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="calls-tab__recording">
      <button className="calls-tab__play-btn" onClick={toggle} title={playing ? 'Pause' : 'Play recording'}>
        {playing ? <FiPause /> : <FiPlay />}
      </button>
      <audio
        ref={audioRef}
        src={url}
        onEnded={() => setPlaying(false)}
        preload="none"
      />
    </div>
  );
}

export default function CallsTab({ leadId }) {
  const { calls, loading } = useCalls(leadId);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const formatDuration = (s) => {
    if (!s) return '—';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  if (loading) return <div className="calls-tab__loading">Loading calls...</div>;

  return (
    <div className="calls-tab">
      <div className="calls-tab__header">
        <h3 className="calls-tab__title">Calls ({calls.length})</h3>
      </div>
      {calls.length === 0 ? (
        <p className="calls-tab__empty">No calls logged yet.</p>
      ) : (
        <div className="calls-tab__list">
          {calls.map((c) => {
            const DirIcon = c.direction === 'inbound' ? FiPhoneIncoming : FiPhoneOutgoing;
            return (
              <div className="calls-tab__item" key={c.id}>
                <DirIcon className={`calls-tab__item-icon calls-tab__item-icon--${c.direction}`} />
                <div className="calls-tab__item-info">
                  <div className="calls-tab__item-top">
                    <span className="calls-tab__item-direction">
                      {c.direction === 'inbound' ? 'Inbound' : 'Outbound'}
                    </span>
                    {c.outcome && (
                      <span className={`calls-tab__outcome calls-tab__outcome--${c.outcome}`}>
                        {c.outcome.replace(/_/g, ' ')}
                      </span>
                    )}
                    <span className="calls-tab__item-duration">{formatDuration(c.duration_seconds)}</span>
                  </div>
                  {c.summary && <p className="calls-tab__item-summary">{c.summary}</p>}
                  {c.recording_url && <RecordingPlayer url={c.recording_url} />}
                  <span className="calls-tab__item-meta">
                    {c.called_by} · {formatDate(c.called_at)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
