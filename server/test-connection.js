const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing Supabase Connection...\n');
console.log('Supabase URL:', supabaseUrl ? 'Configured' : 'Missing');
console.log('Service Key:', supabaseServiceKey ? 'Configured' : 'Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\nError: Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    console.log('\nTesting database connection...');

    const { data: tables, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Error connecting to database:', error.message);
      process.exit(1);
    }

    console.log('✓ Database connection successful!');

    const { data: adminCount } = await supabase
      .from('admins')
      .select('count');

    console.log(`✓ Found ${adminCount ? adminCount.length : 0} admin(s) in database`);

    console.log('\nDatabase is ready for use!');
  } catch (err) {
    console.error('Connection test failed:', err.message);
    process.exit(1);
  }
}

testConnection();
