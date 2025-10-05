import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAdminStatus = async (currentUser: User | null) => {
      try {
        if (!currentUser) {
          setIsAdmin(false);
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUser(currentUser);

        // Use the secure has_role RPC function
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: currentUser.id,
          _role: 'admin'
        });

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('Error in checkAdminStatus:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      checkAdminStatus(session?.user ?? null);
    });

    // Check initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      checkAdminStatus(user);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isAdmin, isAuthenticated, loading, user };
};
