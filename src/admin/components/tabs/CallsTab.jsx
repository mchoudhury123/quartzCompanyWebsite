import { useState, useRef, useCallback } from 'react';
import useCalls from '../../hooks/useCalls';
import { FiPhone, FiPhoneIncoming, FiPhoneOutgoing, FiPlay, FiPause } from 'react-icons/fi';
import './CallsTab.css';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function RecordingPlayer({ url }) {
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const proxyUrl = `/api/twilio-recording?url=${encodeURIComponent(url)}`;

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setLoaded(true);
    }
  }, []);

  const handleSeek = (e) => {
    if (!audioRef.current || !progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * duration;
    setCurrentTime(audioRef.current.currentTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="recording-player">
      <button className="recording-player__btn" onClick={toggle} title={playing ? 'Pause' : 'Play recording'}>
        {playing ? <FiPause /> : <FiPlay />}
      </button>
      <div className="recording-player__track" ref={progressRef} onClick={handleSeek}>
        <div className="recording-player__progress" style={{ width: `${progress}%` }} />
        <div className="recording-player__thumb" style={{ left: `${progress}%` }} />
      </div>
      <span className="recording-player__time">
        {formatTime(currentTime)} / {loaded ? formatTime(duration) : '--:--'}
      </span>
      <audio
        ref={audioRef}
        src={proxyUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => { setPlaying(false); setCurrentTime(0); }}
        preload="metadata"
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
