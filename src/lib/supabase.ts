import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fidwxvehffegmcmfowml.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZHd4dmVoZmZlZ21jbWZvd21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2OTc1NjMsImV4cCI6MjA5MTI3MzU2M30.o-G0-VC8lXwptaTYEePTMuy3qYDtT56r4_O3Ul7pj0M';

export const supabase = createClient(supabaseUrl, supabaseKey);
