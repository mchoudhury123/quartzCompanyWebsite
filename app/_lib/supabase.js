import { createClient } from '@supabase/supabase-js';

let cached = null;

function getClient() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      'Supabase env vars not set. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env (same values as your VITE_SUPABASE_* vars).'
    );
  }
  cached = createClient(url, key);
  return cached;
}

export const supabase = {
  from: (...args) => getClient().from(...args),
  auth: new Proxy({}, { get: (_, prop) => (...args) => getClient().auth[prop](...args) }),
  rpc: (...args) => getClient().rpc(...args),
  storage: new Proxy({}, { get: (_, prop) => (...args) => getClient().storage[prop](...args) }),
};
