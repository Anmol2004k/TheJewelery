import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oadkresiuupjythvdhtn.supabase.co';
const supabaseKey = 'sb_publishable_GITyK1cTSoqpy1qYNzh-4A_Vu0CVnpz';

export const supabase = createClient(supabaseUrl, supabaseKey);
