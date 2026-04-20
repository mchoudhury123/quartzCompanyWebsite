import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import websiteProducts from '../../data/products.json';

// Stone materials are sourced directly from the website product catalogue
// (src/data/products.json) so admin quote pricing always matches what
// customers see, including any live sale discounts. Non-stone products
// (accessories, processes) continue to come from Supabase.
function buildStoneProducts() {
  return websiteProducts.map((wp) => {
    const onSale = !!wp.onSale;
    const discount = Number(wp.discount) || 0;
    const originalPrice20 = onSale ? Number(wp.originalPrice) : Number(wp.price20mm);
    const originalPrice30 = onSale && discount
      ? Number(wp.price30mm) / (1 - discount / 100)
      : Number(wp.price30mm);

    return {
      id: `web-${wp.id}`,
      name: wp.name,
      category: 'stones',
      material_type: (wp.material || '').toLowerCase().includes('marble') ? 'marble' : 'quartz',
      price_20mm: Number(wp.price20mm),
      price_30mm: Number(wp.price30mm),
      original_price_20mm: originalPrice20,
      original_price_30mm: originalPrice30,
      on_sale: onSale,
      discount_percent: discount,
      unit: 'per sqm',
      active: true,
    };
  });
}

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('name');

      const nonStones = (data || []).filter((p) => p.category !== 'stones');
      const stones = buildStoneProducts();

      if (mounted) {
        setProducts([...stones, ...nonStones]);
        setLoading(false);
      }
    };
    fetchProducts();
    return () => { mounted = false; };
  }, []);

  return { products, loading };
}
