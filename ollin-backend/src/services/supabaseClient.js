const { createClient } = require('@supabase/supabase-js')
const ws = require('ws')
const config = require('../config/env')

let client = null

function getSupabase() {
  if (client) return client
  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    return null
  }
  client = createClient(config.supabaseUrl, config.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { transport: ws },
  })
  return client
}

module.exports = { getSupabase }
