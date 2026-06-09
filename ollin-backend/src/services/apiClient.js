const axios = require('axios')
const config = require('../config/env')
const { incrementRequestCount } = require('../lib/requestCounter')

function createApiClient(baseURL) {
  return axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'x-apisports-key': config.apiSportsKey,
    },
  })
}

const footballClient = createApiClient(config.footballBaseUrl)
const baseballClient = createApiClient(config.baseballBaseUrl)

async function apiGet(client, path, params, redis) {
  try {
    const response = await client.get(path, { params })
    if (redis) {
      await incrementRequestCount(redis, 1)
    }
    return { ok: true, data: response.data?.response ?? [], raw: response.data }
  } catch (err) {
    const status = err.response?.status
    const message = err.response?.data?.message || err.message
    console.error(`[ollin][api] GET ${path} falló (${status ?? 'network'}):`, message)
    return { ok: false, error: message, status }
  }
}

module.exports = {
  footballClient,
  baseballClient,
  apiGet,
}
