import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { logAppointmentStatus } from '../utils/appointmentActivity';
import {
  FiUser, FiPhone, FiMapPin, FiClock, FiCheck, FiCheckCircle, FiCalendar,
} from 'react-icons/fi';
import './TodaysTodo.css';

/* Appointment type presets with colours — mirrors AppointmentsPage APPT_TYPES */
const APPT_TYPES = [
  { value: 'Home Appointment', color: '#c5a47e' },
  { value: 'Template / Measure', color: '#8b7fc7' },
  { value: 'Installation', color: '#6b8f71' },
  { value: 'Follow Up Call', color: '#d4874e' },
  { value: 'Consultation', color: '#d4748b' },
  { value: 'Other', color: '#9e9e9e' },
];

function getTypeColor(title) {
  const match = APPT_TYPES.find((t) => t.value === title);
  return match ? match.color : '#9e9e9e';
}

/* Local (not UTC) YYYY-MM-DD so "today" is correct in UK time */
function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? 'pm' : 'am';
  const h12 = hour % 12 || 12;
  return `${h12}:${m}${period}`;
}

export default function TodaysTodo() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchToday = useCallback(async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, leads:lead_id(id, full_name, phone)')
      .eq('date', todayStr())
      .order('time', { ascending: true });
    if (error) console.error('Failed to fetch today\'s appointments:', error.message);
    setAppointments(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchToday(); }, [fetchToday]);

  const markDone = async (id) => {
    const appt = appointments.find((a) => a.id === id);
    // Optimistic update — only touches the internal appointments table
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'completed' } : a))
    );
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'completed' })
      .eq('id', id);
    if (error) {
      console.error('Failed to mark appointment done:', error.message);
      fetchToday(); // revert to server truth on failure
      return;
    }
    // Record completion in the linked customer's timeline.
    if (appt) await logAppointmentStatus(appt, 'completed');
  };

  const dateLabel = new Date(todayStr() + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const outstanding = appointments.filter(
    (a) => a.status === 'scheduled'
  ).length;

  return (
    <section className="todays-todo">
      <div className="todays-todo__head">
        <div>
          <h2 className="todays-todo__title">
            <FiCalendar /> Today&rsquo;s To-Do
          </h2>
          <p className="todays-todo__sub">{dateLabel}</p>
        </div>
        {!loading && (
          <span className="todays-todo__count">
            {outstanding} {outstanding === 1 ? 'task' : 'tasks'} outstanding
          </span>
        )}
      </div>

      {loading ? (
        <p className="todays-todo__empty">Loading today&rsquo;s tasks&hellip;</p>
      ) : appointments.length === 0 ? (
        <p className="todays-todo__empty">
          Nothing booked in for today. <Link to="/admin/appointments">Open appointments</Link>
        </p>
      ) : (
        <ul className="todays-todo__list">
          {appointments.map((a) => {
            const done = a.status === 'completed';
            const cancelled = a.status === 'cancelled' || a.status === 'no_show';
            const name = a.customer_name || a.leads?.full_name;
            const phone = a.customer_phone || a.leads?.phone;
            return (
              <li
                key={a.id}
                className={`todays-todo__item${done ? ' is-done' : ''}${cancelled ? ' is-cancelled' : ''}`}
                style={{ borderLeftColor: getTypeColor(a.title) }}
              >
                <div className="todays-todo__item-main">
                  <div className="todays-todo__item-top">
                    <span className="todays-todo__time">
                      <FiClock /> {formatTime(a.time)}
                    </span>
                    <span
                      className="todays-todo__type"
                      style={{ background: getTypeColor(a.title) }}
                    >
                      {a.title}
                    </span>
                    {cancelled && (
                      <span className="todays-todo__status-tag">
                        {a.status === 'no_show' ? 'No show' : 'Cancelled'}
                      </span>
                    )}
                  </div>
                  <div className="todays-todo__details">
                    {name && <span className="todays-todo__detail"><FiUser /> {name}</span>}
                    {phone && <span className="todays-todo__detail"><FiPhone /> {phone}</span>}
                    {a.location && <span className="todays-todo__detail"><FiMapPin /> {a.location}</span>}
                  </div>
                  {a.notes && <p className="todays-todo__notes">{a.notes}</p>}
                </div>
                <div className="todays-todo__item-action">
                  {done ? (
                    <span className="todays-todo__done-label"><FiCheckCircle /> Done</span>
                  ) : !cancelled ? (
                    <button
                      type="button"
                      className="todays-todo__done-btn"
                      onClick={() => markDone(a.id)}
                    >
                      <FiCheck /> Mark done
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
