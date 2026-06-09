const { createClient } = require('@supabase/supabase-js')
const config = require('../config/env')

let client = null

function getSupabase() {
  if (client) return client
  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    return null
  }
  client = createClient(config.supabaseUrl, config.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return client
}

module.exports = { getSupabase }
