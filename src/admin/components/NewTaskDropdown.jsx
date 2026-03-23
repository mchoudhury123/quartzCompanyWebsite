import { useState, useRef, useEffect } from 'react';
import { FiPlus, FiPhone, FiMessageSquare, FiMail, FiPackage, FiFileText, FiPaperclip, FiCalendar } from 'react-icons/fi';
import './NewTaskDropdown.css';

const TASKS = [
  { key: 'call', label: 'Call Lead', icon: FiPhone },
  { key: 'sms', label: 'Send SMS', icon: FiMessageSquare },
  { key: 'email', label: 'Send Email', icon: FiMail },
  { key: 'sample', label: 'New Sample', icon: FiPackage },
  { key: 'quote', label: 'Create Quote', icon: FiFileText },
  { key: 'file', label: 'Add Files', icon: FiPaperclip },
  { key: 'appointment', label: 'Book Appointment', icon: FiCalendar },
];

export default function NewTaskDropdown({ onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (key) => {
    setOpen(false);
    onSelect(key);
  };

  return (
    <div className="new-task-dropdown" ref={ref}>
      <button className="new-task-dropdown__trigger" onClick={() => setOpen(!open)}>
        <FiPlus /> New Task
      </button>
      {open && (
        <div className="new-task-dropdown__menu">
          {TASKS.map((t) => (
            <button key={t.key} className="new-task-dropdown__item" onClick={() => handleSelect(t.key)}>
              <t.icon className="new-task-dropdown__item-icon" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
