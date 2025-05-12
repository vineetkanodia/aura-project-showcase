
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<{ error: any }>;
}

interface ProfileData {
  username?: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [prevAuthState, setPrevAuthState] = useState<string | null>(null);

  useEffect(() => {
    // First check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setPrevAuthState(currentSession ? 'SIGNED_IN' : 'SIGNED_OUT');
      setIsLoading(false);
      setInitialLoad(false); // Mark initial load complete
    });

    // Then set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        // Only show toasts for actual changes in auth state, not on initial load or redundant events
        if (!initialLoad && event !== prevAuthState) {
          if (event === 'SIGNED_IN' && prevAuthState !== 'SIGNED_IN') {
            toast.success('Signed in successfully!');
          } else if (event === 'SIGNED_OUT' && prevAuthState !== 'SIGNED_OUT') {
            toast.success('Signed out successfully!');
          }
          setPrevAuthState(event);
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [initialLoad, prevAuthState]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username || email.split('@')[0],
            avatar_url: userData.avatar_url || null,
            first_name: userData.first_name || '',
            last_name: userData.last_name || ''
          },
        },
      });
      
      if (!error) {
        toast.success('Account created! Please check your email for verification.');
      }
      
      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out.');
      throw error; // Re-throw for the calling function to handle
    }
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    try {
      if (!user) return { error: new Error('User not authenticated') };
      
      // Update user metadata in auth.users
      const { error } = await supabase.auth.updateUser({
        data: {
          ...data
        }
      });
      
      if (!error) {
        toast.success('Profile updated successfully!');
      }
      
      return { error };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
