import { supabase } from './client.js';

export async function register({ fullName, email, phoneNumber, password }) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(), password,
    options: {
      emailRedirectTo: new URL('./profile.html', window.location.href).href,
      data: { full_name: fullName.trim(), phone_number: phoneNumber.trim() },
    },
  });
  if (error) throw error;
  // The SQL trigger creates the profile, even without an authenticated session.
  return data;
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function currentUser() {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!sessionData.session) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles')
    .select('id, full_name, email, phone_number, created_at, updated_at')
    .eq('id', userId).single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, { fullName, phoneNumber }) {
  const { data, error } = await supabase.from('profiles')
    .update({ full_name: fullName.trim(), phone_number: phoneNumber.trim() })
    .eq('id', userId).select().single();
  if (error) throw error;
  return data;
}

// Synchronous callback: do not await Supabase calls inside it.
export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}
