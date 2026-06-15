# Review dump — `pollLiveFixtureEvents` (polling.js líneas 80–130)

Archivo: `ollin-backend/src/services/polling.js`

```javascript
      redis
    )

    if (!result.ok) {
      console.warn(`[ollin][polling] Events falló fixture=${fixtureId}`)
      continue
    }

    await setJson(eventsKey(fixtureId), result.data, ttl)

    // Detectar diffs de estadísticas y emitir eventos sintéticos
    const statsResult = await apiGet(
      footballClient,
      '/fixtures/statistics',
      { fixture: fixtureId },
      redis
    )
    if (statsResult.ok && Array.isArray(statsResult.data) && statsResult.data.length > 0) {
      const nextSnap = parseStatMap(statsResult.data)
      const prevSnap = lastStatsSnapshot[fixtureId] || { home: {}, away: {} }
      const elapsed  = fixture?.fixture?.status?.elapsed ?? null
      const homeTeam = fixture?.teams?.home?.name || 'Local'
      const awayTeam = fixture?.teams?.away?.name || 'Visitante'

      const synthetic = detectDiffs(prevSnap, nextSnap, elapsed, homeTeam, awayTeam)
      lastStatsSnapshot[fixtureId] = nextSnap

      if (synthetic.length > 0 && ioRef) {
        ioRef.emit(`ollin:ticker:${fixtureId}`, { events: synthetic, at: new Date().toISOString() })
      }
    }

    if (ioRef) {
      ioRef.emit(`ollin:partido:${fixtureId}`, {
        events: result.data,
        at: new Date().toISOString(),
      })
    }
  }
}

async function pollStandingsBatch(redis) {
  for (const ligaId of TORNEO_SELECCIONES_LIGAS) {
    try {
      await fetchStandings(ligaId, redis)
    } catch (err) {
      console.warn(`[ollin][polling] Standings falló liga=${ligaId}:`, err.message)
    }
  }
}

```

**Nota:** La función `pollLiveFixtureEvents` empieza en la línea 69 (`async function pollLiveFixtureEvents...`). Las líneas 80–119 son el cuerpo del loop + cierre de la función; 121–129 es el inicio de `pollStandingsBatch`.
