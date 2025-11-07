// test-supabase.mjs
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

(async () => {
    try {
        const { data, error } = await supabase
            .from('chats')
            .insert([{ user_id: null, title: 'Node script test chat (no user)' }])
            .select();

        console.log('insert result:', data, error);
    } catch (err) {
        console.error('unexpected error:', err);
    }
})();
