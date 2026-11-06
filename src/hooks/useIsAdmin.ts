import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAIL = 'chidikegprosper@gmail.com';

export function useIsAdmin() {
  const [state, setState] = useState({ isAdmin: false, ready: false });

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ isAdmin: session?.user?.email === ADMIN_EMAIL, ready: true });
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return state;
}
