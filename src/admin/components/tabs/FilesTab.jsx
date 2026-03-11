import { useState } from 'react';
import useFiles from '../../hooks/useFiles';
import { FiPlus, FiDownload, FiTrash2, FiFile, FiImage, FiFileText } from 'react-icons/fi';
import './FilesTab.css';

const FILE_ICON_MAP = {
  'image/': FiImage,
  'application/pdf': FiFileText,
};

function getFileIcon(type) {
  if (!type) return FiFile;
  for (const [prefix, Icon] of Object.entries(FILE_ICON_MAP)) {
    if (type.startsWith(prefix)) return Icon;
  }
  return FiFile;
}

function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function FilesTab({ leadId, onUploadFile }) {
  const { files, loading, deleteFile, getDownloadUrl } = useFiles(leadId);
  const [deleting, setDeleting] = useState(null);

  const handleDownload = async (file) => {
    const url = await getDownloadUrl(file.storage_path);
    if (url) window.open(url, '_blank');
  };

  const handleDelete = async (fileId) => {
    if (!confirm('Delete this file?')) return;
    setDeleting(fileId);
    await deleteFile(fileId);
    setDeleting(null);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  if (loading) return <div className="files-tab__loading">Loading files...</div>;

  return (
    <div className="files-tab">
      <div className="files-tab__header">
        <h3 className="files-tab__title">Files ({files.length})</h3>
        <button className="files-tab__add" onClick={onUploadFile}>
          <FiPlus /> Upload
        </button>
      </div>
      {files.length === 0 ? (
        <p className="files-tab__empty">No files uploaded yet.</p>
      ) : (
        <div className="files-tab__list">
          {files.map((f) => {
            const Icon = getFileIcon(f.file_type);
            return (
              <div className="files-tab__item" key={f.id}>
                <Icon className="files-tab__item-icon" />
                <div className="files-tab__item-info">
                  <span className="files-tab__item-name">{f.file_name}</span>
                  <span className="files-tab__item-meta">
                    {formatSize(f.file_size)} · {f.category} · {formatDate(f.created_at)}
                  </span>
                </div>
                <div className="files-tab__item-actions">
                  <button className="files-tab__item-btn" onClick={() => handleDownload(f)} title="Download">
                    <FiDownload />
                  </button>
                  <button
                    className="files-tab__item-btn files-tab__item-btn--delete"
                    onClick={() => handleDelete(f.id)}
                    disabled={deleting === f.id}
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
