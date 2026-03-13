import './StatusBadge.css';

const statusConfig = {
  new: { label: 'New', className: 'status-badge--new' },
  contacted: { label: 'Contacted', className: 'status-badge--contacted' },
  quoted: { label: 'Quoted', className: 'status-badge--quoted' },
  deposit: { label: 'Deposit', className: 'status-badge--deposit' },
  accepted: { label: 'Accepted', className: 'status-badge--accepted' },
  rejected: { label: 'Rejected', className: 'status-badge--rejected' },
  expired: { label: 'Expired', className: 'status-badge--expired' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.new;
  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
}
