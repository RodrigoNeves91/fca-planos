import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, AuthState } from '../types';

const AuthContext = createContext<AuthState & {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, sector: string) => Promise<void>;
  logout: () => Promise<void>;
} | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Timeout de segurança — nunca fica preso no loading
    const timeout = setTimeout(() => {
      setAuthState(prev => {
        if (prev.loading) {
          return { user: null, loading: false, error: null };
        }
        return prev;
      });
    }, 5000);

    checkAuth().finally(() => clearTimeout(timeout));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadProfile(session.user.id, session.user.email || '');
      } else {
        setAuthState({ user: null, loading: false, error: null });
      }
    });

    return () => {
      subscription?.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function loadProfile(userId: string, email: string) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      setAuthState({
        user: {
          id: userId,
          email,
          name: profile?.name || email.split('@')[0],
          sector: profile?.sector || profile?.setor || 'Geral',
          is_admin: profile?.is_admin || profile?.role === 'admin' || email === 'admin@empresa.com',
        },
        loading: false,
        error: null,
      });
    } catch {
      setAuthState({
        user: { id: userId, email, name: email.split('@')[0], sector: 'Geral', is_admin: false },
        loading: false,
        error: null,
      });
    }
  }

  async function checkAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadProfile(session.user.id, session.user.email || '');
      } else {
        setAuthState({ user: null, loading: false, error: null });
      }
    } catch {
      setAuthState({ user: null, loading: false, error: null });
    }
  }

  async function login(email: string, password: string) {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: error instanceof Error ? error.message : 'Login failed', loading: false }));
      throw error;
    }
  }

  async function signup(email: string, password: string, name: string, sector: string) {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { data: { user }, error: signupError } = await supabase.auth.signUp({ email, password });
      if (signupError) throw signupError;
      if (!user) throw new Error('Signup failed');
      const is_admin = email === 'admin@empresa.com';
      await supabase.from('profiles').insert([{ id: user.id, name, sector, setor: sector, is_admin, role: is_admin ? 'admin' : 'user' }]);
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: error instanceof Error ? error.message : 'Signup failed', loading: false }));
      throw error;
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setAuthState({ user: null, loading: false, error: null });
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
