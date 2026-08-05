import { logActivity } from './activityLogger';

/**
 * Appointment → customer timeline logging.
 * Every appointment action taken with a client (booked, status changed,
 * deleted) is recorded in that lead's activity history so the timeline
 * always reflects what has been done with the customer. No-ops when the
 * appointment isn't linked to a lead (lead_id null).
 */

const STATUS_VERBS = {
  scheduled: 'rescheduled',
  completed: 'completed',
  cancelled: 'cancelled',
  no_show: 'marked as no-show',
};

function whenLabel(appt) {
  if (!appt?.date) return null;
  const date = new Date(`${appt.date}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const time = appt.time ? appt.time.slice(0, 5) : null;
  const loc = appt.location ? ` · ${appt.location}` : '';
  return `${date}${time ? ` at ${time}` : ''}${loc}`;
}

export async function logAppointmentBooked(appt) {
  if (!appt?.lead_id) return;
  await logActivity(appt.lead_id, {
    type: 'appointment_booked',
    title: `Appointment booked — ${appt.title}`,
    description: whenLabel(appt),
    metadata: {
      appointment_id: appt.id || null,
      date: appt.date,
      time: appt.time || null,
      location: appt.location || null,
    },
  });
}

export async function logAppointmentStatus(appt, newStatus) {
  if (!appt?.lead_id) return;
  const verb = STATUS_VERBS[newStatus] || `set to ${newStatus}`;
  const type = newStatus === 'cancelled' || newStatus === 'no_show'
    ? 'appointment_cancelled'
    : 'appointment_updated';
  await logActivity(appt.lead_id, {
    type,
    title: `Appointment ${verb} — ${appt.title}`,
    description: whenLabel(appt),
    metadata: { appointment_id: appt.id || null, status: newStatus },
  });
}

export async function logAppointmentDeleted(appt) {
  if (!appt?.lead_id) return;
  await logActivity(appt.lead_id, {
    type: 'appointment_cancelled',
    title: `Appointment deleted — ${appt.title}`,
    description: whenLabel(appt),
    metadata: { appointment_id: appt.id || null, date: appt.date, time: appt.time || null },
  });
}
