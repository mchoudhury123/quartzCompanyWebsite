import { FiX } from 'react-icons/fi';
import './ModalShell.css';

export default function ModalShell({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-shell" onClick={(e) => e.stopPropagation()}>
        <div className="modal-shell__header">
          <h3 className="modal-shell__title">{title}</h3>
          <button className="modal-shell__close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-shell__body">
          {children}
        </div>
      </div>
    </div>
  );
}
