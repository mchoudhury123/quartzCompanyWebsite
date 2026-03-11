import useOrders from '../../hooks/useOrders';
import { FiTruck } from 'react-icons/fi';
import './OrdersTab.css';

const ORDER_STATUSES = ['pending', 'confirmed', 'in_production', 'ready', 'dispatched', 'installed', 'completed', 'cancelled'];

export default function OrdersTab({ leadId }) {
  const { orders, loading, updateOrderStatus } = useOrders(leadId);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }) : '—';

  const formatCurrency = (v) => `£${Number(v || 0).toFixed(2)}`;

  if (loading) return <div className="orders-tab__loading">Loading orders...</div>;

  return (
    <div className="orders-tab">
      <div className="orders-tab__header">
        <h3 className="orders-tab__title">Orders ({orders.length})</h3>
      </div>
      {orders.length === 0 ? (
        <p className="orders-tab__empty">No orders yet. Orders are created when a quote is accepted.</p>
      ) : (
        <div className="orders-tab__list">
          {orders.map((o) => (
            <div className="orders-tab__card" key={o.id}>
              <div className="orders-tab__card-top">
                <div className="orders-tab__card-left">
                  <FiTruck className="orders-tab__card-icon" />
                  <div>
                    <span className="orders-tab__card-number">{o.order_number}</span>
                    <span className={`orders-tab__status orders-tab__status--${o.status}`}>
                      {o.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                <span className="orders-tab__card-total">{formatCurrency(o.total)}</span>
              </div>
              <div className="orders-tab__card-meta">
                <span>Deposit: {formatCurrency(o.deposit_amount)} {o.deposit_paid ? '(Paid)' : '(Unpaid)'}</span>
                {o.installation_date && <span>Install: {formatDate(o.installation_date)}</span>}
              </div>
              {o.notes && <p className="orders-tab__card-notes">{o.notes}</p>}
              <div className="orders-tab__card-actions">
                <select
                  className="orders-tab__status-select"
                  value={o.status}
                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
