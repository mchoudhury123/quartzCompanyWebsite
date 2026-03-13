import './StatusSelect.css';

const statuses = ['new', 'contacted', 'quoted', 'deposit'];

export default function StatusSelect({ value, onChange }) {
  return (
    <select
      className="status-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
}
