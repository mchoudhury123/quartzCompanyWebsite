import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { logActivity } from '../utils/activityLogger';

export default function useOrders(leadId) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lead_orders')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }, [leadId]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateOrderStatus = async (orderId, status) => {
    const { error } = await supabase
      .from('lead_orders')
      .update({ status })
      .eq('id', orderId);
    if (!error) {
      const o = orders.find((o) => o.id === orderId);
      await logActivity(leadId, {
        type: 'order_updated',
        title: `Order ${o?.order_number || ''} updated to ${status}`,
        metadata: { order_id: orderId, status },
      });
      await fetch();
    }
    return { error };
  };

  return { orders, loading, updateOrderStatus, refetch: fetch };
}
