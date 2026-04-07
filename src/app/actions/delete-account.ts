'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// We use service role to have admin privileges (deleting from auth.users)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function deleteUserAccount(userId: string) {
  try {
    // 1. Delete user from auth.users (this also deletes related data if ON DELETE CASCADE is set, 
    // but better to clean up main tables manually if needed)
    
    // Check for active reservations first? 
    // The requirement said to WARN, not necessarily block, but let's be thorough.
    
    // Delete from public tables first to avoid FK issues
    await supabaseAdmin.from('reservations').delete().eq('user_id', userId); // if user_id exists there
    await supabaseAdmin.from('orders').delete().eq('user_id', userId);
    await supabaseAdmin.from('user_profiles').delete().eq('id', userId);

    // Finally, delete the user from Auth
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (error) throw error;

    return { success: true };
  } catch (err: any) {
    console.error('Error deleting account:', err);
    return { success: false, error: err.message };
  }
}
