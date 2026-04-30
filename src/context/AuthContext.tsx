import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

export interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function sessionToUser(session: Session | null): User | null {
  if (!session?.user) return null;
  const meta = session.user.user_metadata;
  return {
    name: meta?.name ?? session.user.email?.split('@')[0] ?? 'Användare',
    email: session.user.email ?? '',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(sessionToUser(session));
      setIsLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(sessionToUser(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!email.trim() || !password.trim()) {
      return { success: false, error: 'Fyll i e-post och lösenord.' };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: 'Fel e-post eller lösenord.' };
      }
      if (error.message.includes('Email not confirmed')) {
        return { success: false, error: 'Bekräfta din e-post innan du loggar in.' };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!name.trim()) {
      return { success: false, error: 'Ange ditt namn.' };
    }
    if (!email.includes('@')) {
      return { success: false, error: 'Ange en giltig e-postadress.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Lösenordet måste vara minst 6 tecken.' };
    }

    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { name: name.trim() },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, error: 'Det finns redan ett konto med den e-postadressen.' };
      }
      return { success: false, error: error.message };
    }

    // After sign-up Supabase may auto-confirm (if email confirmation is off)
    // or require email confirmation. Either way the session listener handles it.
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextType = {
    user,
    isLoggedIn: user !== null,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
