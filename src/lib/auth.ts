import { supabase } from './supabase';
import toast from 'react-hot-toast';
import { AuthError } from '@supabase/supabase-js';

export interface AuthResponse {
  success: boolean;
  error?: string;
}

export async function signUp(email: string, password: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) throw error;
    
    toast.success('Account created successfully! Please check your email.');
    return { success: true };
  } catch (error) {
    const message = error instanceof AuthError ? error.message : 'Failed to create account';
    toast.error(message);
    return { success: false, error: message };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    toast.success('Signed in successfully!');
    return { success: true };
  } catch (error) {
    const message = error instanceof AuthError ? error.message : 'Invalid login credentials';
    toast.error(message);
    return { success: false, error: message };
  }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast.error('Error signing out');
  }
}