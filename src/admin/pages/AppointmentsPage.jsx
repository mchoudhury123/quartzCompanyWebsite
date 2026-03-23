import { useState, useMemo } from 'react';
import useAppointments from '../hooks/useAppointments';
import {
  FiChevronLeft, FiChevronRight, FiPlus, FiClock, FiUser,
  FiPhone, FiMapPin, FiTrash2, FiCheck, FiX, FiAlertCircle,
} from 'react-icons/fi';
import './AppointmentsPage.css';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const STATUS_OPTIONS = ['scheduled', 'completed', 'cancelled', 'no_show'];

function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function AppointmentsPage() {
  const { appointments, loading, createAppointment, updateAppointment, deleteAppointment } = useAppointments();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: '',
    customer_name: '',
    customer_phone: '',
    date: '',
    time: '10:00',
    duration_minutes: 60,
    location: '',
    notes: '',
  });

  const resetForm = () => {
    setForm({
      title: '',
      customer_name: '',
      customer_phone: '',
      date: selectedDate || '',
      time: '10:00',
      duration_minutes: 60,
      location: '',
      notes: '',
    });
  };

  // Group appointments by date
  const apptsByDate = useMemo(() => {
    const map = {};
    appointments.forEach((a) => {
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    });
    return map;
  }, [appointments]);

  // Calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    // Monday = 0 in our grid
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const days = [];
    // Previous month padding
    const prevMonth = new Date(viewYear, viewMonth, 0);
    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(viewYear, viewMonth, -i);
      days.push({ date: d, str: toDateStr(d), inMonth: false });
    }
    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(viewYear, viewMonth, i);
      days.push({ date: d, str: toDateStr(d), inMonth: true });
    }
    // Next month padding to complete the grid
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(viewYear, viewMonth + 1, i);
        days.push({ date: d, str: toDateStr(d), inMonth: false });
      }
    }
    return days;
  }, [viewYear, viewMonth]);

  const todayStr = toDateStr(today);

  // Navigation
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };
  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  // Stats
  const stats = useMemo(() => {
    const thisMonth = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
    const monthAppts = appointments.filter((a) => a.date.startsWith(thisMonth));
    return {
      total: monthAppts.length,
      scheduled: monthAppts.filter((a) => a.status === 'scheduled').length,
      completed: monthAppts.filter((a) => a.status === 'completed').length,
      cancelled: monthAppts.filter((a) => a.status === 'cancelled').length,
    };
  }, [appointments, viewYear, viewMonth]);

  // Selected day appointments
  const selectedAppts = selectedDate ? (apptsByDate[selectedDate] || []) : [];

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time) return;
    setSaving(true);
    await createAppointment({
      title: form.title,
      customer_name: form.customer_name || null,
      customer_phone: form.customer_phone || null,
      date: form.date,
      time: form.time,
      duration_minutes: form.duration_minutes,
      location: form.location || null,
      notes: form.notes || null,
    });
    setSaving(false);
    setShowForm(false);
    resetForm();
  };

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setShowForm(false);
  };

  const openNewForm = (dateStr) => {
    setSelectedDate(dateStr || selectedDate);
    setForm((prev) => ({ ...prev, date: dateStr || selectedDate || todayStr }));
    setShowForm(true);
  };

  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const statusIcon = (status) => {
    if (status === 'completed') return <FiCheck className="appt-status-icon appt-status-icon--completed" />;
    if (status === 'cancelled') return <FiX className="appt-status-icon appt-status-icon--cancelled" />;
    if (status === 'no_show') return <FiAlertCircle className="appt-status-icon appt-status-icon--no-show" />;
    return <FiClock className="appt-status-icon appt-status-icon--scheduled" />;
  };

  if (loading) return <div className="admin-page-loading">Loading appointments...</div>;

  return (
    <div className="appt-page">
      <div className="appt-page__header">
        <h1 className="appt-page__title">Appointments</h1>
        <button className="appt-page__add-btn" onClick={() => openNewForm(todayStr)}>
          <FiPlus /> New Appointment
        </button>
      </div>

      {/* Stats bar */}
      <div className="appt-stats">
        <div className="appt-stats__item">
          <span className="appt-stats__num">{stats.total}</span>
          <span className="appt-stats__label">This Month</span>
        </div>
        <div className="appt-stats__item appt-stats__item--scheduled">
          <span className="appt-stats__num">{stats.scheduled}</span>
          <span className="appt-stats__label">Scheduled</span>
        </div>
        <div className="appt-stats__item appt-stats__item--completed">
          <span className="appt-stats__num">{stats.completed}</span>
          <span className="appt-stats__label">Completed</span>
        </div>
        <div className="appt-stats__item appt-stats__item--cancelled">
          <span className="appt-stats__num">{stats.cancelled}</span>
          <span className="appt-stats__label">Cancelled</span>
        </div>
      </div>

      <div className="appt-page__body">
        {/* Calendar */}
        <div className="appt-calendar">
          <div className="appt-calendar__nav">
            <button className="appt-calendar__nav-btn" onClick={prevMonth}><FiChevronLeft /></button>
            <div className="appt-calendar__nav-center">
              <h2 className="appt-calendar__month">{MONTHS[viewMonth]} {viewYear}</h2>
              <button className="appt-calendar__today-btn" onClick={goToday}>Today</button>
            </div>
            <button className="appt-calendar__nav-btn" onClick={nextMonth}><FiChevronRight /></button>
          </div>

          <div className="appt-calendar__grid">
            {DAYS.map((d) => (
              <div className="appt-calendar__day-header" key={d}>{d}</div>
            ))}
            {calendarDays.map((day) => {
              const count = (apptsByDate[day.str] || []).length;
              const isToday = day.str === todayStr;
              const isSelected = day.str === selectedDate;
              return (
                <button
                  key={day.str}
                  className={
                    'appt-calendar__cell' +
                    (!day.inMonth ? ' appt-calendar__cell--outside' : '') +
                    (isToday ? ' appt-calendar__cell--today' : '') +
                    (isSelected ? ' appt-calendar__cell--selected' : '')
                  }
                  onClick={() => handleDateClick(day.str)}
                >
                  <span className="appt-calendar__date-num">{day.date.getDate()}</span>
                  {count > 0 && (
                    <span className="appt-calendar__dot-row">
                      {count <= 3
                        ? Array.from({ length: count }).map((_, i) => (
                            <span className="appt-calendar__dot" key={i} />
                          ))
                        : <span className="appt-calendar__count-badge">{count}</span>
                      }
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        <div className="appt-panel">
          {showForm ? (
            <div className="appt-form">
              <div className="appt-form__header">
                <h3 className="appt-form__title">New Appointment</h3>
                <button className="appt-form__close" onClick={() => setShowForm(false)}><FiX /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <label className="appt-form__label">
                  Title *
                  <input
                    className="appt-form__input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Home survey, Showroom visit"
                    required
                  />
                </label>
                <label className="appt-form__label">
                  Customer Name
                  <input
                    className="appt-form__input"
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    placeholder="Customer name"
                  />
                </label>
                <label className="appt-form__label">
                  Phone
                  <input
                    className="appt-form__input"
                    type="tel"
                    value={form.customer_phone}
                    onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </label>
                <div className="appt-form__row">
                  <label className="appt-form__label">
                    Date *
                    <input
                      className="appt-form__input"
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      required
                    />
                  </label>
                  <label className="appt-form__label">
                    Time *
                    <input
                      className="appt-form__input"
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      required
                    />
                  </label>
                </div>
                <div className="appt-form__row">
                  <label className="appt-form__label">
                    Duration
                    <select
                      className="appt-form__input"
                      value={form.duration_minutes}
                      onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
                    >
                      <option value={30}>30 min</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </label>
                  <label className="appt-form__label">
                    Location
                    <input
                      className="appt-form__input"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="Address or 'Showroom'"
                    />
                  </label>
                </div>
                <label className="appt-form__label">
                  Notes
                  <textarea
                    className="appt-form__textarea"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Any additional details..."
                    rows={3}
                  />
                </label>
                <button className="appt-form__submit" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Book Appointment'}
                </button>
              </form>
            </div>
          ) : selectedDate ? (
            <div className="appt-day-view">
              <div className="appt-day-view__header">
                <h3 className="appt-day-view__title">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', {
                    weekday: 'long', day: 'numeric', month: 'long',
                  })}
                </h3>
                <button className="appt-day-view__add" onClick={() => openNewForm(selectedDate)}>
                  <FiPlus /> Add
                </button>
              </div>
              {selectedAppts.length === 0 ? (
                <div className="appt-day-view__empty">
                  <p>No appointments on this day.</p>
                  <button className="appt-day-view__empty-btn" onClick={() => openNewForm(selectedDate)}>
                    Book Appointment
                  </button>
                </div>
              ) : (
                <div className="appt-day-view__list">
                  {selectedAppts
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((a) => (
                    <div className={`appt-card appt-card--${a.status}`} key={a.id}>
                      <div className="appt-card__top">
                        <div className="appt-card__time">
                          {statusIcon(a.status)}
                          <span>{formatTime(a.time)}</span>
                          <span className="appt-card__duration">{a.duration_minutes}min</span>
                        </div>
                        <select
                          className="appt-card__status-select"
                          value={a.status}
                          onChange={(e) => updateAppointment(a.id, { status: e.target.value })}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}</option>
                          ))}
                        </select>
                      </div>
                      <h4 className="appt-card__title">{a.title}</h4>
                      {a.customer_name && (
                        <div className="appt-card__detail"><FiUser /> {a.customer_name}</div>
                      )}
                      {a.customer_phone && (
                        <div className="appt-card__detail"><FiPhone /> {a.customer_phone}</div>
                      )}
                      {a.location && (
                        <div className="appt-card__detail"><FiMapPin /> {a.location}</div>
                      )}
                      {a.notes && (
                        <p className="appt-card__notes">{a.notes}</p>
                      )}
                      <button
                        className="appt-card__delete"
                        onClick={() => { if (window.confirm('Delete this appointment?')) deleteAppointment(a.id); }}
                      >
                        <FiTrash2 /> Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="appt-panel__placeholder">
              <p>Select a date on the calendar to view or add appointments.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
