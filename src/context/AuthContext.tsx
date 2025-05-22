
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  checkIsAdmin: () => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any, isUsernameError?: boolean, isEmailError?: boolean }>;
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

// Username validation function
const isValidUsername = (username: string): boolean => {
  // Only allow letters, numbers, and underscores (no spaces or special chars)
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return usernameRegex.test(username);
};

// Password validation function with friendly message
const validatePassword = (password: string): { isValid: boolean, message: string } => {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isValid = hasLowercase && hasUppercase && hasNumber;
  
  if (!isValid) {
    let message = "Password must include:";
    if (!hasLowercase) message += " a lowercase letter,";
    if (!hasUppercase) message += " an uppercase letter,";
    if (!hasNumber) message += " a number,";
    return { isValid, message: message.slice(0, -1) }; // Remove trailing comma
  }
  
  return { isValid: true, message: "" };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckAttempts, setAdminCheckAttempts] = useState(0);

  // Check if user is admin with retry logic
  const checkIsAdmin = async (): Promise<boolean> => {
    try {
      if (!user) return false;
      
      setAdminCheckAttempts(prev => prev + 1);
      
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If error is due to no matching row, not a connection issue
        if (error.code === 'PGRST116') {
          console.log('User is not an admin:', user.email);
          setIsAdmin(false);
          return false;
        }
        
        console.error('Error checking admin status:', error);
        
        // If we've already tried multiple times, don't spam the user with errors
        if (adminCheckAttempts <= 2) {
          toast.error('Failed to verify admin status. Please try refreshing the page.');
        }
        
        // Don't change current admin state on error to avoid disruption
        return isAdmin;
      }
      
      const adminStatus = roles?.role === 'admin';
      console.log('Admin status check:', user.email, adminStatus);
      setIsAdmin(adminStatus);
      setAdminCheckAttempts(0); // Reset counter on successful check
      return adminStatus;
    } catch (error) {
      console.error('Error checking admin status:', error);
      
      // Only show toast on first few attempts
      if (adminCheckAttempts <= 2) {
        toast.error('Network error while checking permissions. Please try again later.');
      }
      
      return isAdmin; // Keep current state on error
    }
  };

  useEffect(() => {
    // First check for existing session silently (without toasts)
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Check admin status after session is loaded
          await checkIsAdmin().catch(err => {
            console.error('Initial admin check failed:', err);
          });
        }
      } catch (error) {
        console.error('Error retrieving session:', error);
        toast.error('Failed to retrieve your session. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
        setIsFirstLoad(false);
      }
    };
    
    initializeAuth();
    
    // Then set up auth state listener with toasts only for actual events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event);
        
        // Only update state if it's actually different to avoid loops
        const sessionChanged = JSON.stringify(session) !== JSON.stringify(currentSession);
        if (sessionChanged) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          // Check admin status when auth state changes
          if (currentSession?.user) {
            await checkIsAdmin().catch(err => {
              console.error('Admin check on auth change failed:', err);
            });
          } else {
            setIsAdmin(false);
          }
        }
        
        // Only show toasts for actual sign in/out events, not initial page load
        // and not for session refreshes
        if (!isFirstLoad && event !== 'TOKEN_REFRESHED' && sessionChanged) {
          if (event === 'SIGNED_IN') {
            toast.success('Signed in successfully!');
          } else if (event === 'SIGNED_OUT') {
            toast.success('Signed out successfully!');
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Keep dependencies empty to run only once

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        // Check admin status after successful sign in
        await checkIsAdmin();
      }
      
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // Validate username format
      if (!isValidUsername(userData.username)) {
        return { 
          error: new Error('Username can only contain letters, numbers, and underscores (no spaces or special characters).'),
          isUsernameError: true
        };
      }

      // Validate password complexity
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return { error: new Error(passwordValidation.message) };
      }

      // Check if username already exists
      const { data: existingUsers, error: fetchError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', userData.username)
        .limit(1);

      if (fetchError) {
        console.error('Error checking username:', fetchError);
        return { error: fetchError };
      }

      if (existingUsers && existingUsers.length > 0) {
        return { 
          error: new Error('This username is already taken. Please choose another one.'),
          isUsernameError: true
        };
      }
      
      // Proceed with signup
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            avatar_url: userData.avatar_url || null,
            first_name: userData.first_name || '',
            last_name: userData.last_name || ''
          },
        },
      });
      
      if (!error) {
        toast.success('Account created! Please check your email for verification.');
      } else if (error.message.includes('email')) {
        // Handle duplicate email error from the API
        return { 
          error: new Error('An account with this email already exists.'),
          isEmailError: true
        };
      }
      
      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast.error(`Error signing out: ${error.message}`);
      } else {
        setIsAdmin(false);
      }
    } catch (error: any) {
      console.error('Exception signing out:', error);
      toast.error('Error signing out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    try {
      if (!user) return { error: new Error('User not authenticated') };
      
      // Validate username if it's being updated
      if (data.username) {
        if (!isValidUsername(data.username)) {
          toast.error('Username can only contain letters, numbers, and underscores (no spaces or special characters).');
          return { error: new Error('Invalid username format') };
        }
        
        // Check if username already exists (but isn't the current user's username)
        const { data: existingUsers, error: fetchError } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', data.username)
          .neq('id', user.id)
          .limit(1);

        if (fetchError) {
          console.error('Error checking username:', fetchError);
          return { error: fetchError };
        }

        if (existingUsers && existingUsers.length > 0) {
          toast.error('This username is already taken. Please choose another one.');
          return { error: new Error('Username already taken') };
        }
      }
      
      // Update user metadata in auth.users
      const { error } = await supabase.auth.updateUser({
        data: {
          ...data
        }
      });
      
      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile. Please try again.');
        return { error };
      }
      
      toast.success('Profile updated successfully!');
      return { error: null };
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
      return { error };
    }
  };

  const value = {
    session,
    user,
    isLoading,
    isAdmin,
    checkIsAdmin,
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
