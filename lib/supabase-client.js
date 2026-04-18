import { createClient } from '@supabase/supabase-js';

// Service-role client — bypasses RLS. Used in serverless functions only.
// NEVER expose SUPABASE_SERVICE_ROLE_KEY to the frontend.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

/**
 * Verify a Supabase JWT from the Authorization header and return the user.
 * Throws if the token is missing or invalid.
 */
export async function getUserFromToken(token) {
  if (!token) throw new Error('No token provided');
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) throw new Error('Invalid or expired token');
  return user;
}
