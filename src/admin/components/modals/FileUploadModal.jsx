import { useState, useRef } from 'react';
import ModalShell from './ModalShell';
import useFiles from '../../hooks/useFiles';
import { FiUpload } from 'react-icons/fi';

const CATEGORIES = ['general', 'measurement', 'plan', 'photo', 'contract', 'invoice'];

export default function FileUploadModal({ leadId, onClose }) {
  const { uploadFile } = useFiles(leadId);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState('general');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const inputRef = useRef(null);

  const handleFiles = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;
    setSaving(true);
    for (const file of selectedFiles) {
      await uploadFile(file, category);
    }
    setSaving(false);
    onClose();
  };

  return (
    <ModalShell title="Upload Files" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-field">
          <label className="modal-field__label">Category</label>
          <select className="modal-field__select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Files</label>
          <div
            className="file-upload-drop"
            onClick={() => inputRef.current?.click()}
          >
            <FiUpload style={{ fontSize: '1.5rem', color: 'var(--admin-text-light)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-light)', marginTop: '0.5rem' }}>
              {selectedFiles.length > 0
                ? `${selectedFiles.length} file(s) selected`
                : 'Click to select files'
              }
            </span>
            <input
              ref={inputRef}
              type="file"
              multiple
              onChange={handleFiles}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        {selectedFiles.length > 0 && (
          <div style={{ marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--admin-text-light)' }}>
            {selectedFiles.map((f, i) => (
              <div key={i}>{f.name} ({(f.size / 1024).toFixed(1)} KB)</div>
            ))}
          </div>
        )}
        <div className="modal-actions">
          <button type="button" className="modal-actions__btn modal-actions__btn--cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="modal-actions__btn modal-actions__btn--submit" disabled={saving || selectedFiles.length === 0}>
            {saving ? 'Uploading...' : `Upload ${selectedFiles.length} file(s)`}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
