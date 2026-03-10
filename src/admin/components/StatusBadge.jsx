import './StatusBadge.css';

const statusConfig = {
  new: { label: 'New', className: 'status-badge--new' },
  contacted: { label: 'Contacted', className: 'status-badge--contacted' },
  quoted: { label: 'Quoted', className: 'status-badge--quoted' },
  won: { label: 'Won', className: 'status-badge--won' },
  lost: { label: 'Lost', className: 'status-badge--lost' },
  deposit: { label: 'Deposit', className: 'status-badge--deposit' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.new;
  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
}
