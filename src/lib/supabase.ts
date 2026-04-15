import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fidwxvehffegmcmfowml.supabase.co';
const supabaseKey = 'sb_publishable_jUN_c4xhVpourT9KonM_aQ_dCTp0pe2';

export const supabase = createClient(supabaseUrl, supabaseKey);
