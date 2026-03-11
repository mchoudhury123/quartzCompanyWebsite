import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('name');
      if (mounted) {
        setProducts(data || []);
        setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  return { products, loading };
}
