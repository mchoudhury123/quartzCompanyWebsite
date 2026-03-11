import { supabase } from '../../lib/supabase';

/**
 * Inserts an activity record into lead_activities.
 * Called by all mutation hooks to maintain a full timeline.
 */
export async function logActivity(leadId, { type, title, description = null, metadata = {}, author = 'Admin' }) {
  const { error } = await supabase
    .from('lead_activities')
    .insert({
      lead_id: leadId,
      activity_type: type,
      title,
      description,
      metadata,
      author,
    });
  if (error) console.error('Activity log failed:', error.message);
}
