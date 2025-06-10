// supabase-test.ts - Run this to test basic connectivity
import { supabase } from '../supa_database/config/supabase'

export async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...')

  try {
    // Test 1: Basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }

    console.log('✅ Database connection successful')

    // Test 2: Auth session
    const { data: session } = await supabase.auth.getSession()
    console.log('✅ Auth client working, session:', session.session ? 'Active' : 'None')

    return true
  } catch (err) {
    console.error('❌ Connection test failed:', err)
    return false
  }
}

// Run the test
testSupabaseConnection()
