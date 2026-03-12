import { useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import './NotesTab.css';

export default function NotesTab({ notes, onAddNote }) {
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!body.trim()) return;
    setSaving(true);
    await onAddNote(body.trim());
    setBody('');
    setSaving(false);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const sorted = [...notes].reverse();

  return (
    <div className="notes-tab">
      <div className="notes-tab__header">
        <h3 className="notes-tab__title">Notes ({notes.length})</h3>
      </div>
      <div className="notes-tab__form">
        <textarea
          className="notes-tab__input"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a note about this customer..."
          rows={3}
        />
        <button
          className="notes-tab__add"
          onClick={handleAdd}
          disabled={saving || !body.trim()}
        >
          <FiEdit3 /> {saving ? 'Saving...' : 'Add Note'}
        </button>
      </div>
      {sorted.length === 0 ? (
        <p className="notes-tab__empty">No notes yet. Add one above.</p>
      ) : (
        <div className="notes-tab__list">
          {sorted.map((n) => (
            <div className="notes-tab__item" key={n.id}>
              <p className="notes-tab__item-body">{n.content}</p>
              <span className="notes-tab__item-meta">
                {n.author} &middot; {formatDate(n.created_at)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
