// pages/api/test-supabase.js
import { testSupabaseConnection } from '../../tests/supabase-test'

export default async function handler(req, res) {
  const result = await testSupabaseConnection()
  res.json({ success: result })
}
