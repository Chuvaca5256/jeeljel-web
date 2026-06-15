# Review dump — partidoService fetch

## Resumen (sin editar código)

### `fetchFootballPartido` — llamadas API-Sports

| # | Endpoint | Cuándo |
|---|----------|--------|
| 0–1 | `GET /fixtures?id=` | Solo si **no** hay `seedRaw` (fixture desde listas Redis) |
| 5 en paralelo | `/fixtures/statistics`, `/fixtures/events`, `/fixtures/lineups`, `/fixtures/players`, `/fixtures/headtohead` | Siempre (H2H omitido si faltan IDs) |

**Total:** **5 llamadas** con seed de listas · **6 llamadas** sin seed.

`apiGet(..., redis)` puede usar caché interna de `apiClient` (Redis por request key), además del caché del payload completo en `fetchPartido`.

### Redis — caché del payload completo

- Clave: `ollin:partido:${id}` (`partidoKey`)
- TTL: `PARTIDO_TTL_MS = 60 * 1000` (**60 segundos**)
- `fetchPartido` devuelve caché si existe; si no, llama `fetchFootballPartido`, luego `setJson`.

### Cada cuánto se llama `fetchPartido`

- **HTTP:** `GET /api/ollin/fixtures/partido/:id` → `routes/partido.js` → `fetchPartido(id, redis)` **en cada request**.
- **Frontend `usePartido`:** `loadPartido()` al montar la página + en cada `ollin:update` (polling backend ~15s live / ~3min idle). `ollin:partido:{id}` **no** re-fetch (solo parchea `events`).
- **Efecto caché:** como máximo **1 miss API completo por partido cada 60s** por usuario que dispare GET; hits Redis no llaman API-Sports.

---

## Código — constantes y clave Redis

```javascript
const PARTIDO_TTL_MS = 60 * 1000

function partidoKey(id) {
  return `ollin:partido:${id}`
}
```

## Código — `fetchFootballPartido`

```javascript
async function fetchFootballPartido(id, redis, seedRaw) {
  let fixtureRaw = seedRaw

  if (!fixtureRaw) {
    const fx = await apiGet(footballClient, '/fixtures', { id }, redis)
    if (!fx.ok || !fx.data?.length) return null
    fixtureRaw = sanitizeFootballFixture(fx.data[0])
  } else {
    fixtureRaw = sanitizeFootballFixture(fixtureRaw)
  }

  const homeId = fixtureRaw.teams?.home?.id
  const awayId = fixtureRaw.teams?.away?.id
  const fixtureId = fixtureRaw.fixture?.id

  const [statsRes, eventsRes, lineupsRes, playersRes, h2hRes] = await Promise.all([
    apiGet(footballClient, '/fixtures/statistics', { fixture: fixtureId }, redis),
    apiGet(footballClient, '/fixtures/events', { fixture: fixtureId }, redis),
    apiGet(footballClient, '/fixtures/lineups', { fixture: fixtureId }, redis),
    apiGet(footballClient, '/fixtures/players', { fixture: fixtureId }, redis),
    homeId && awayId
      ? apiGet(footballClient, '/fixtures/headtohead', { h2h: `${homeId}-${awayId}`, last: 5 }, redis)
      : Promise.resolve({ ok: true, data: [] }),
  ])

  const statistics = statsRes.ok ? parseFootballStatistics(statsRes.data) : { home: {}, away: {}, items: [] }
  const events = eventsRes.ok ? parseFootballEvents(eventsRes.data) : []
  const lineups = lineupsRes.ok ? parseFootballLineups(lineupsRes.data, fixtureRaw) : { home: null, away: null }
  const players = playersRes.ok ? parseFootballPlayers(playersRes.data) : { home: [], away: [] }
  const h2h = h2hRes.ok ? parseFootballH2H(h2hRes.data) : []

  const merged = { ...fixtureRaw, statistics: statsRes.ok ? statsRes.data : [] }

  return {
    sport: 'futbol',
    summary: buildSummary(merged, 'futbol'),
    statistics,
    events,
    lineups,
    players,
    h2h,
    updatedAt: new Date().toISOString(),
  }
}
```

## Código — `fetchPartido` (orquestador + Redis)

```javascript
async function fetchPartido(id, redis) {
  const cached = await getJson(partidoKey(id))
  if (cached) return cached

  const fromList = await findInLists(id)
  let sport = fromList?.sport || 'futbol'

  let payload = null

  if (sport === 'futbol' || !fromList) {
    payload = await fetchFootballPartido(id, redis, fromList?.sport === 'futbol' ? fromList.raw : null)
    if (payload) sport = 'futbol'
  }

  if (!payload) {
    payload = await fetchBaseballPartido(id, redis, fromList?.sport === 'beisbol' ? fromList.raw : null)
    if (payload) sport = 'beisbol'
  }

  if (!payload && fromList) {
    sport = fromList.sport
    payload =
      sport === 'beisbol'
        ? await fetchBaseballPartido(id, redis, fromList.raw)
        : await fetchFootballPartido(id, redis, fromList.raw)
  }

  if (!payload) return null

  if (!payload.summary?.sport) {
    payload.summary.sport = payload.sport || detectSportFromLeague(payload.summary?.leagueId)
  }

  await setJson(partidoKey(id), payload, PARTIDO_TTL_MS)
  return payload
}
```

## Ruta HTTP que lo invoca

```javascript
// ollin-backend/src/routes/partido.js
router.get('/partido/:id', async (req, res) => {
  ...
  const data = await fetchPartido(id, redis)
  ...
  res.json(data)
})
```
