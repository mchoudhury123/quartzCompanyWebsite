import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { logAppointmentBooked, logAppointmentStatus, logAppointmentDeleted } from '../utils/appointmentActivity';

export default function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*, leads:lead_id(id, full_name, phone, email)')
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    if (error) console.error('Failed to fetch appointments:', error.message);
    setAppointments(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const createAppointment = async (appt) => {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appt)
      .select()
      .single();
    if (!error) {
      // Record the booking in the linked customer's timeline.
      await logAppointmentBooked(data);
      await fetchAll();
    }
    return { data, error };
  };

  const updateAppointment = async (id, updates) => {
    const existing = appointments.find((a) => a.id === id);
    const { error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id);
    if (!error) {
      // Log status changes (completed / cancelled / no-show / rescheduled) to the timeline.
      if (existing && updates.status && updates.status !== existing.status) {
        await logAppointmentStatus(existing, updates.status);
      }
      await fetchAll();
    }
    return { error };
  };

  const deleteAppointment = async (id) => {
    const existing = appointments.find((a) => a.id === id);
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    if (!error) {
      if (existing) await logAppointmentDeleted(existing);
      await fetchAll();
    }
    return { error };
  };

  return { appointments, loading, createAppointment, updateAppointment, deleteAppointment, refetch: fetchAll };
}
