import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface ProfileData {
  username?: string;
  avatar_url?: string;
  full_name?: string;
  bio?: string;
  first_name?: string; // Added first_name property
  last_name?: string;  // Added last_name property
}

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (params: SignUpParams) => Promise<SignUpResult>;
  signIn: (params: SignInParams) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<ForgotPasswordResult>;
  resetPassword: (password: string) => Promise<ResetPasswordResult>;
  updateProfile: (data: ProfileData) => Promise<UpdateProfileResult>;
}

interface SignUpParams {
  email: string;
  password: string;
  username: string;
}

interface SignUpResult {
  error?: Error;
  isPasswordError?: boolean;
  isUsernameError?: boolean;
  isEmailError?: boolean;
}

interface SignInParams {
  email: string;
  password: string;
}

interface SignInResult {
  error?: Error;
}

interface ForgotPasswordResult {
  error?: Error;
}

interface ResetPasswordResult {
  error?: Error;
}

interface UpdateProfileResult {
  error?: Error;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  isLoading: true,
  signUp: async () => ({ }),
  signIn: async () => ({ }),
  signOut: async () => { },
  forgotPassword: async () => ({ }),
  resetPassword: async () => ({ }),
  updateProfile: async () => ({ }),
});

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Password validation
  const isPasswordValid = (password: string): boolean => {
    // Check for at least one lowercase letter
    const hasLowercase = /[a-z]/.test(password);
    // Check for at least one uppercase letter
    const hasUppercase = /[A-Z]/.test(password);
    // Check for at least one digit
    const hasDigit = /\d/.test(password);
    // Check minimum length
    const hasMinLength = password.length >= 8;

    return hasLowercase && hasUppercase && hasDigit && hasMinLength;
  };

  // Username validation
  const isUsernameValid = (username: string): boolean => {
    // Check if username contains only alphanumeric characters (no spaces or special chars)
    return /^[a-zA-Z0-9]+$/.test(username);
  };

  const signUp = async ({ email, password, username }: SignUpParams): Promise<SignUpResult> => {
    // Validate password
    if (!isPasswordValid(password)) {
      return { 
        error: new Error('Password must be at least 8 characters long and include uppercase letters, lowercase letters, and numbers.'),
        isPasswordError: true 
      };
    }

    // Validate username (alphanumeric only)
    if (!isUsernameValid(username)) {
      return { 
        error: new Error('Username can only contain letters and numbers (no spaces or special characters).'),
        isUsernameError: true 
      };
    }

    // Check if username exists in profiles
    const { data: existingProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .limit(1);
    
    if (profileError) {
      console.error('Error checking username:', profileError);
    } else if (existingProfiles && existingProfiles.length > 0) {
      return { 
        error: new Error('Username is already taken.'),
        isUsernameError: true
      };
    }

    // Instead of checking if email exists (which requires admin rights),
    // we'll proceed with signup and handle any duplicate email errors from the API
    
    // Proceed with signup
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      // Check for duplicate email error
      if (error.message.includes('email')) {
        return {
          error,
          isEmailError: true
        };
      }
      return { error };
    }

    return {};
  };

  const signIn = async ({ email, password }: SignInParams): Promise<SignInResult> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    return {};
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Failed to sign out. Please try again.");
        console.error("Sign out error:", error);
      } else {
        // The onAuthStateChange listener will update the state
        toast.success("Signed out successfully");
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const forgotPassword = async (email: string): Promise<ForgotPasswordResult> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { error };
    }

    return {};
  };

  const resetPassword = async (password: string): Promise<ResetPasswordResult> => {
    // Validate password
    if (!isPasswordValid(password)) {
      return { 
        error: new Error('Password must be at least 8 characters long and include uppercase letters, lowercase letters, and numbers.') 
      };
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return { error };
    }

    return {};
  };

  const updateProfile = async (data: ProfileData): Promise<UpdateProfileResult> => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    // First, update user metadata in auth.users
    let userUpdateError;
    if (data.full_name || data.first_name || data.last_name) {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: data.full_name,
          first_name: data.first_name,
          last_name: data.last_name
        }
      });
      userUpdateError = error;
    }

    if (userUpdateError) {
      return { error: userUpdateError };
    }
    
    // Then update profile in profiles table
    const updates = {
      id: user.id,
      ...(data.username && { username: data.username }),
      ...(data.avatar_url && { avatar_url: data.avatar_url }),
      ...(data.full_name && { full_name: data.full_name }),
      ...(data.bio && { bio: data.bio }),
      updated_at: new Date().toISOString(),
    };

    // Check if username already exists (if changing username)
    if (data.username) {
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', data.username)
        .neq('id', user.id)
        .limit(1);
        
      if (checkError) {
        return { error: checkError };
      }
      
      if (existingUsers && existingUsers.length > 0) {
        return { error: new Error('Username is already taken') };
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      return { error };
    }

    // Refresh user session after update
    const { data: { session: newSession } } = await supabase.auth.getSession();
    if (newSession) {
      setSession(newSession);
      setUser(newSession.user);
    }

    return {};
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    forgotPassword,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
