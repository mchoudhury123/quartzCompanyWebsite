import './StatsCard.css';

export default function StatsCard({ label, value, color }) {
  return (
    <div className="stats-card" style={{ '--accent': color || 'var(--color-gold, #c5a47e)' }}>
      <div className="stats-card__value">{value}</div>
      <div className="stats-card__label">{label}</div>
    </div>
  );
}
