# Review dump — header marcador partido

## Dónde se monta desde `OllinPartido.jsx`

El encabezado **no está inline** en `OllinPartido.jsx`. Solo se pasa `summary` (de `usePartido` → GET `/api/ollin/fixtures/partido/:id`) y `sport`:

```jsx
// src/pages/OllinPartido.jsx (líneas 67-68, 101)
const summary = data?.summary
const sport = resolveSport(summary, data)

<PartidoHeader summary={summary} sport={sport} />
```

---

## Fragmento real: `src/components/ollin/partido/PartidoHeader.jsx`

### Variables que alimentan (1) minuto y (2) posesión

| Qué | Variable / fuente |
|-----|-------------------|
| **(1) Minuto en header** | Estado local `elapsed` ← `summary?.elapsed` (backend `buildSummary` → `status.elapsed`). Se muestra vía `matchTime` (no `elapsed` directo en JSX). |
| **`matchTime`** | Si `FT/AET/PEN` → `'FT'`; si `HT` → `'HT'`; si `isLive && elapsed != null` → `` `${elapsed}'` ``; si no → `statusShort` o `'–'`. |
| **`isLive`** | `['1H','2H','ET','BT','P','LIVE'].includes(summary?.statusShort)` |
| **Punto verde** | `{isLive && <span className="ollin-ph__live-dot" />}` dentro de `.ollin-ph__time--live` |
| **Timer local** | `useEffect` + `setInterval` 60s incrementa `elapsed` mientras `isLive` |
| **Sync backend** | `useEffect([summary?.elapsed])` + `visibilitychange` resetea `elapsed` |
| **(2) Barra posesión** | `summary?.miniStats?.possessionHome` (string/number del backend). Visitante = `100 - parseInt(possessionHome)`. Solo renderiza si `possessionHome != null`. |

### JSX + lógica completa del componente

```jsx
export default function PartidoHeader({ summary, sport }) {
  const isLive = ['1H','2H','ET','BT','P','LIVE'].includes(summary?.statusShort || '')
  const statusShort = summary?.statusShort || ''
  const [elapsed, setElapsed] = useState(summary?.elapsed ?? null)

  useEffect(() => {
    setElapsed(summary?.elapsed ?? null)
  }, [summary?.elapsed])

  useEffect(() => {
    if (!isLive) return
    const t = setInterval(() => {
      setElapsed(prev => (prev != null ? prev + 1 : prev))
    }, 60000)
    return () => clearInterval(t)
  }, [isLive])

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        setElapsed(summary?.elapsed ?? null)
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [summary?.elapsed])

  if (!summary) return null

  const matchTime = (() => {
    if (['FT','AET','PEN'].includes(statusShort)) return 'FT'
    if (statusShort === 'HT') return 'HT'
    if (isLive && elapsed != null) return `${elapsed}'`
    return statusShort || '–'
  })()

  return (
    <div className="ollin-ph">
      <div className="ollin-ph__row">

        {/* LOCAL — summary.homeTeam, summary.homeScore */}
        <div className="ollin-ph__team ollin-ph__team--home">
          <div className="ollin-ph__badge">
            {summary?.homeTeam?.initials || 'LOC'}
          </div>
          <span className="ollin-ph__team-name">{summary?.homeTeam?.name || 'Local'}</span>
        </div>

        {/* MARCADOR + (1) MINUTO/RELOJ */}
        <div className="ollin-ph__score-block">
          <div className="ollin-ph__score">
            <span>{summary?.homeScore ?? 0}</span>
            <span className="ollin-ph__score-sep">–</span>
            <span>{summary?.awayScore ?? 0}</span>
          </div>
          <div className={`ollin-ph__time${isLive ? ' ollin-ph__time--live' : ''}`}>
            {isLive && <span className="ollin-ph__live-dot" />}
            {matchTime}
          </div>
        </div>

        {/* VISITANTE — summary.awayTeam, summary.awayScore */}
        <div className="ollin-ph__team ollin-ph__team--away">
          <div className="ollin-ph__badge ollin-ph__badge--away">
            {summary?.awayTeam?.initials || 'VIS'}
          </div>
          <span className="ollin-ph__team-name">{summary?.awayTeam?.name || 'Visitante'}</span>
        </div>

      </div>

      {/* (2) BARRA DE POSESIÓN — summary.miniStats.possessionHome */}
      {summary?.miniStats?.possessionHome != null && (
        <div className="ollin-ph__poss-bar-wrap">
          <span className="ollin-ph__poss-num" style={{color:'#f97316'}}>
            {summary.miniStats.possessionHome}%
          </span>
          <div className="ollin-ph__poss-track">
            <div className="ollin-ph__poss-fill" style={{width:`${summary.miniStats.possessionHome}%`}} />
          </div>
          <span className="ollin-ph__poss-num" style={{color:'#38bdf8'}}>
            {100 - parseInt(summary.miniStats.possessionHome)}%
          </span>
        </div>
      )}
    </div>
  )
}
```

### Resumen rápido

1. **Minuto:** pinta `{matchTime}` en `.ollin-ph__time`, derivado de `elapsed` (estado) + `isLive` + `statusShort`. Punto verde solo si `isLive`.
2. **Posesión:** pinta `summary.miniStats.possessionHome` en número local, ancho de `.ollin-ph__poss-fill`, y `100 - parseInt(...)` visitante. CSS: `.ollin-ph__poss-*` en `OllinDeportes.css`.
