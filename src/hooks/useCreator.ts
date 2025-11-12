import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const useCreator = () => {
  const [isCreator, setIsCreator] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkCreatorStatus = async (currentUser: User | null) => {
      try {
        if (!currentUser) {
          setIsCreator(false);
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUser(currentUser);

        // For now, all authenticated users can access creator dashboard
        // TODO: Implement proper creator role check when role system is updated
        setIsCreator(true);
      } catch (error) {
        console.error('Error in checkCreatorStatus:', error);
        setIsCreator(false);
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      checkCreatorStatus(session?.user ?? null);
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      checkCreatorStatus(user);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isCreator, isAuthenticated, loading, user };
};
