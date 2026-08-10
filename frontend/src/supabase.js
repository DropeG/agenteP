import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pomojglyrqffqjknemup.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'sb_secret_js0ebPHNZrdI6m1sLp3K0w_63w9u08R';

export const supabase = createClient(supabaseUrl, supabaseKey);
