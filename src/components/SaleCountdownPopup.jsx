import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { SALE_END, SALE_END_LABEL } from '../config/sale';
import './SaleCountdownPopup.css';

// Once dismissed, don't nag again this browsing session.
const DISMISS_KEY = 'saleCountdownDismissed';

function getRemaining() {
  const diff = SALE_END.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function SaleCountdownPopup() {
  const [visible, setVisible] = useState(false);
  const [remaining, setRemaining] = useState(getRemaining());

  const close = useCallback(() => {
    setVisible(false);
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch (_) { /* private mode */ }
  }, []);

  // Show 2s after landing — once per session, and only while the sale is live.
  useEffect(() => {
    if (getRemaining() === null) return undefined;
    try { if (sessionStorage.getItem(DISMISS_KEY)) return undefined; } catch (_) { /* ignore */ }
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Tick the countdown every second while open.
  useEffect(() => {
    if (!visible) return undefined;
    const id = setInterval(() => {
      const r = getRemaining();
      setRemaining(r);
      if (r === null) setVisible(false); // sale ended while open
    }, 1000);
    return () => clearInterval(id);
  }, [visible]);

  // Close on Escape.
  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, close]);

  if (!visible || !remaining) return null;

  const units = [
    { label: 'Days', value: remaining.days },
    { label: 'Hrs', value: remaining.hours },
    { label: 'Mins', value: remaining.minutes },
    { label: 'Secs', value: remaining.seconds },
  ];

  return (
    <div
      className="sale-popup"
      role="dialog"
      aria-modal="true"
      aria-label="Summer sale offer"
      onClick={close}
    >
      <div className="sale-popup__card" onClick={(e) => e.stopPropagation()}>
        <button className="sale-popup__close" onClick={close} aria-label="Close">
          <FiX />
        </button>
        <span className="sale-popup__eyebrow">Summer Sale &middot; Limited Time</span>
        <h2 className="sale-popup__headline">
          <span className="sale-popup__percent">40% Off</span> All Worktops
        </h2>
        <p className="sale-popup__sub">
          Ends {SALE_END_LABEL} &mdash; transform your kitchen for less before the sale closes.
        </p>
        <div className="sale-popup__timer">
          {units.map((u) => (
            <div className="sale-popup__unit" key={u.label}>
              <span className="sale-popup__value">{String(u.value).padStart(2, '0')}</span>
              <span className="sale-popup__unit-label">{u.label}</span>
            </div>
          ))}
        </div>
        <Link to="/quote" className="sale-popup__cta" onClick={close}>
          Get Your Free Quote
        </Link>
        <button className="sale-popup__dismiss" onClick={close}>
          No thanks, maybe later
        </button>
      </div>
    </div>
  );
}
