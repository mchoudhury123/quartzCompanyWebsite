import { FiTrash2 } from 'react-icons/fi';
import './LineItemRow.css';

export default function LineItemRow({ item, index, onQuantityChange, onRemove }) {
  return (
    <div className="line-item">
      <div className="line-item__num">{index + 1}</div>
      <div className="line-item__info">
        <span className="line-item__name">{item.product_name}</span>
        <span className="line-item__meta">
          {item.category} · {item.thickness} · {item.unit}
        </span>
      </div>
      <div className="line-item__price">
        £{Number(item.unit_price).toFixed(2)}
      </div>
      <div className="line-item__qty">
        <input
          type="number"
          min="1"
          step="1"
          value={item.quantity}
          onChange={(e) => onQuantityChange(index, Math.max(1, parseInt(e.target.value) || 1))}
          className="line-item__qty-input"
        />
      </div>
      <div className="line-item__total">
        £{Number(item.line_total).toFixed(2)}
      </div>
      <button className="line-item__remove" onClick={() => onRemove(index)}>
        <FiTrash2 />
      </button>
    </div>
  );
}
