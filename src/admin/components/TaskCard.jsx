import { Link } from 'react-router-dom';
import './TaskCard.css';

export default function TaskCard({ label, count, icon: Icon, color, to, href, badge }) {
  const inner = (
    <div className="task-card" style={{ '--card-bg': color || '#c5a47e' }}>
      <div className="task-card__icon-wrap">
        <Icon />
        {badge > 0 && <span className="task-card__badge">{badge}</span>}
      </div>
      <div className="task-card__count">{count ?? ''}</div>
      <div className="task-card__label">{label}</div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="task-card__link">
        {inner}
      </a>
    );
  }

  return (
    <Link to={to} className="task-card__link">
      {inner}
    </Link>
  );
}
