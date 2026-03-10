import { Link } from 'react-router-dom';
import './TaskCard.css';

export default function TaskCard({ label, count, icon: Icon, color, to, href }) {
  const content = (
    <div className="task-card" style={{ '--accent': color || 'var(--color-gold, #c5a47e)' }}>
      <div className="task-card__icon">
        <Icon />
      </div>
      <div className="task-card__body">
        <div className="task-card__label">{label}</div>
        {count !== undefined && (
          <span className="task-card__count">{count}</span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="task-card__link">
        {content}
      </a>
    );
  }

  return (
    <Link to={to} className="task-card__link">
      {content}
    </Link>
  );
}
