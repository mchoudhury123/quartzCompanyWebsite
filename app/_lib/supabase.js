import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const noopChain = () => ({
  select: noopChain,
  insert: async () => ({ data: null, error: { message: 'Supabase env not configured' } }),
  update: async () => ({ data: null, error: { message: 'Supabase env not configured' } }),
  delete: async () => ({ data: null, error: { message: 'Supabase env not configured' } }),
  eq: noopChain,
  single: async () => ({ data: null, error: { message: 'Supabase env not configured' } }),
});

const stub = {
  from: noopChain,
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signIn: async () => ({ data: null, error: { message: 'Supabase env not configured' } }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  rpc: async () => ({ data: null, error: { message: 'Supabase env not configured' } }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: { message: 'Supabase env not configured' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};

export const supabase = url && key ? createClient(url, key) : stub;
