# Review dump — eventos partido (backend + frontend)

## (A) Backend — `ollin-backend/src/services/partidoService.js`

### Origen API

`fetchFootballPartido` llama en paralelo:
- `/fixtures/events` → `parseFootballEvents(eventsRes.data)`
- `/fixtures/statistics` → `parseFootballStatistics(statsRes.data)` y también mergea stats en `buildSummary`

### `parseFootballEvents` + `formatEventLabel` — arreglo de eventos

Cada fila de API-Sports (`/fixtures/events`) se mapea así:

| Campo salida | Campo API-Sports |
|--------------|------------------|
| `minute` | `ev.time.elapsed` o `ev.time.extra` |
| `type` | `ev.type` (ej. Goal, Card, subst) |
| `detail` | `ev.detail` (ej. Yellow Card, Normal Goal) |
| `teamId` | `ev.team.id` |
| `player` | `ev.player.name` (sanitizado) |
| `assist` | `ev.assist.name` (sanitizado) |
| `label` | `formatEventLabel(ev)` — texto ES + emoji |

**Tipos reconocidos en `formatEventLabel`** (por `type` + `detail` en minúsculas):

| Condición | Label |
|-----------|-------|
| `type === 'goal'` o detail incluye `goal` | GOL ⚽ |
| detail `own goal` | GOL EN PROPIA ⚽ |
| detail `penalty` + type goal | GOL DE PENAL ⚽ |
| detail `red card` / `red` | TARJETA ROJA 🟥 |
| detail `yellow card` / `yellow` | TARJETA AMARILLA 🟨 |
| `type === 'subst'` | CAMBIO 🔄 |
| detail `corner` | CORNER 🚩 |
| detail `penalty` | PENAL 🎯 |
| detail `shot on target` | TIRO A PUERTA 🥅 |
| `type === 'foul'` o detail `foul` | FALTA 🟨 |
| detail `free kick` | TIRO LIBRE 🎯 |
| detail `throw in` | SAQUE DE BANDA 🤚 |
| detail `injury` | LESIÓN 🚑 |
| detail `var` | VAR 📺 |
| detail `drink` / `hydration` | PAUSA HIDRATACIÓN 💧 |
| delay, interruption, lightning, rain, pitch invasion, suspended | PARTIDO DETENIDO ⚠️ |
| extra time / added time | TIEMPO AGREGADO ⏱️ |
| fallback | `sanitizeText(detail \|\| type \|\| 'Evento')` |

```javascript
function parseFootballEvents(apiRows) {
  if (!Array.isArray(apiRows)) return []
  return apiRows.map((ev) => ({
    minute: ev.time?.elapsed ?? ev.time?.extra ?? null,
    type: ev.type,
    detail: ev.detail,
    teamSide: ev.team?.id ? 'team' : null,
    teamId: ev.team?.id,
    player: sanitizePlayerName(ev.player?.name),
    assist: sanitizePlayerName(ev.assist?.name),
    label: formatEventLabel(ev),
  }))
}

function formatEventLabel(ev) {
  const detail = (ev.detail || '').toLowerCase()
  const type   = (ev.type   || '').toLowerCase()

  if (type === 'goal' || detail.includes('goal'))          return 'GOL ⚽'
  if (detail.includes('own goal'))                         return 'GOL EN PROPIA ⚽'
  if (detail.includes('penalty') && type === 'goal')       return 'GOL DE PENAL ⚽'
  if (detail.includes('red card') || detail.includes('red')) return 'TARJETA ROJA 🟥'
  if (detail.includes('yellow card') || detail.includes('yellow')) return 'TARJETA AMARILLA 🟨'
  if (type === 'subst')                                    return 'CAMBIO 🔄'
  if (detail.includes('corner'))                           return 'CORNER 🚩'
  if (detail.includes('penalty'))                          return 'PENAL 🎯'
  if (detail.includes('shot on target'))                   return 'TIRO A PUERTA 🥅'
  if (type === 'foul' || detail.includes('foul'))          return 'FALTA 🟨'
  if (detail.includes('free kick'))                        return 'TIRO LIBRE 🎯'
  if (detail.includes('throw in'))                         return 'SAQUE DE BANDA 🤚'
  if (detail.includes('injury'))                           return 'LESIÓN 🚑'
  if (detail.includes('var'))                              return 'VAR 📺'
  if (detail.includes('drink') || detail.includes('hydration')) return 'PAUSA HIDRATACIÓN 💧'
  if (detail.includes('delay') || detail.includes('interruption') ||
      detail.includes('lightning') || detail.includes('rain') ||
      detail.includes('pitch invasion') || detail.includes('suspended')) return 'PARTIDO DETENIDO ⚠️'
  if (detail.includes('extra time') || detail.includes('added time')) return 'TIEMPO AGREGADO ⏱️'
  return sanitizeText(ev.detail || ev.type || 'Evento')
}
```

### `miniStats` y estadísticas — posesión, tiros, córners

**En `summary.miniStats`** (`buildSummary`, fútbol): solo posesión, leída del array `raw.statistics` (respuesta statistics embebida o de `/fixtures/statistics`):

- `possessionHome` → `stats[0].statistics.find(s => s.type === 'Ball Possession').value`
- `possessionAway` → `stats[1].statistics.find(...)`
- `possessionSide` → comparación numérica home vs away

**En `statistics.items`** (`parseFootballStatistics`): tabla para tab ESTADÍSTICAS — lee `apiRows[0|1].statistics[]` con `row.type` / `row.value`:

| key API (`row.type`) | label ES |
|------------------------|----------|
| Ball Possession | Posesión (%) |
| Total Shots | Tiros totales |
| Shots on Goal | Tiros a puerta |
| Corner Kicks | Corners |
| Fouls | Faltas |
| Yellow Cards | Tarjetas amarillas |
| Red Cards | Tarjetas rojas |

```javascript
function parseFootballStatistics(apiRows) {
  if (!Array.isArray(apiRows) || apiRows.length === 0) {
    return { home: {}, away: {}, items: [] }
  }

  const mapStat = (teamBlock) => {
    const out = {}
    for (const row of teamBlock?.statistics || []) {
      out[row.type] = row.value
    }
    return out
  }

  const home = mapStat(apiRows[0])
  const away = mapStat(apiRows[1] || apiRows[0])

  const pick = (key, label, suffix = '') => ({
    key,
    label,
    home: home[key] ?? '—',
    away: away[key] ?? '—',
    suffix,
  })

  const items = [
    pick('Ball Possession', 'Posesión', '%'),
    pick('Total Shots', 'Tiros totales'),
    pick('Shots on Goal', 'Tiros a puerta'),
    pick('Corner Kicks', 'Corners'),
    pick('Fouls', 'Faltas'),
    pick('Yellow Cards', 'Tarjetas amarillas'),
    pick('Red Cards', 'Tarjetas rojas'),
  ]

  return { home, away, items }
}
```

```javascript
    miniStats: {
      possessionHome: stats[0]?.statistics?.find((s) => s.type === 'Ball Possession')?.value,
      possessionAway: stats[1]?.statistics?.find((s) => s.type === 'Ball Possession')?.value,
    },
  }
```

---

## (B) Frontend — `src/components/ollin/partido/FootballFieldLive.jsx`

### Prop que recibe eventos

```javascript
export default function FootballFieldLive({
  summary    = null,
  events     = [],   // ← prop: array de parseFootballEvents (desde OllinPartido: data.events)
  lineups    = null,
  statistics = null,
  partidoId  = null,
})
```

En `OllinPartido.jsx`: `<FootballFieldLive summary={summary} events={data.events} partidoId={id} />`

### Cómo decide cuáles mostrar en la cancha

1. `processed = events.map(...)` — enriquece cada evento con `kind` (`getEventKind`), `isHome`, `zone`, colores, `team`.
2. `fieldEvs = processed.filter(ev => ev.kind !== 'subst')` — **excluye sustituciones** del SVG; el resto se pinta todos a la vez.
3. `timelineEvs = [...processed]` — timeline horizontal muestra **todos** incluidos cambios.

`getEventKind` clasifica por `ev.label`, `ev.type`, `ev.detail` (goal, red, yellow, subst, corner, penalty, shot, freekick, throwin, foul, injury, var, hydration, stoppage, addedtime, other).

### Lógica de tiempo / rotación actual

- **No hay expiración efímera** — todos los `fieldEvs` permanecen en el SVG.
- **Rotación visual `activeDot`**: `useState(null)` + `useEffect` cada **2800 ms** cicla índice sobre `fieldEvs`; empieza en el más reciente (`fieldEvs.length - 1`).
- `isActive = activeDot === i` — solo el evento activo (y goles) muestran pulso, nombre equipo y jugador extra.
- **Goles** (`isGoal`) siempre muestran pulso + labels aunque no estén activos.
- `elapsed` en esquina timeline: `summary?.elapsed` estático (muestra en `.ollin-field2__elapsed` si `isLive`).
- **LiveTicker** aparte: `useTickerEvents(partidoId)` — eventos sintéticos del socket, no afectan `fieldEvs`.

### Bloque JSX — eventos sobre la cancha (SVG)

```jsx
  /* Procesar eventos */
  const processed = events.map(ev => {
    const home = isHomeEvent(ev, summary)
    return {
      ...ev,
      kind:   getEventKind(ev),
      isHome: home,
      zone:   eventZone(ev, home),
      color:  home ? HOME_COLOR : AWAY_COLOR,
      bg:     home ? HOME_BG    : AWAY_BG,
      team:   home ? homeTeam   : awayTeam,
    }
  })

  const timelineEvs = [...processed]
  // En campo: todos los eventos excepto cambios (no tienen ubicación táctica relevante)
  const fieldEvs = processed.filter(ev => ev.kind !== 'subst')

  /* Evento activo ciclado — muestra apellido + equipo del jugador activo */
  const [activeDot, setActiveDot] = useState(null)
  useEffect(() => {
    if (!fieldEvs.length) { setActiveDot(null); return }
    let i = fieldEvs.length - 1  // empieza por el más reciente
    setActiveDot(i)
    const interval = setInterval(() => {
      i = (i + 1) % fieldEvs.length
      setActiveDot(i)
    }, 2800)
    return () => clearInterval(interval)
  }, [events.length]) // eslint-disable-line

// ... SVG ...

          {/* ── EVENTOS EN CAMPO ── */}
          {fieldEvs.map((ev, i) => {
            const meta     = KIND_META[ev.kind]
            const [cpx, cpy] = ev.zone
            // Convertir % de zona interior a coordenadas SVG
            const svgX = 14 + (cpx / 100) * (VW - 28)
            const svgY = 8  + (cpy / 100) * (VH - 16)
            const isActive = activeDot === i
            const isGoal   = ev.kind === 'goal'
            const r        = isGoal ? 12 : 9

            return (
              <g key={i} transform={`translate(${svgX},${svgY})`}>
                {/* Pulso animado */}
                {(isActive || isGoal) && (
                  <circle r={r + 6} fill={ev.color} opacity="0.13">
                    <animate attributeName="r"
                      values={`${r+2};${r+10};${r+2}`} dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity"
                      values="0.18;0.04;0.18" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Círculo del evento */}
                <circle r={r} fill={ev.bg} stroke={ev.color}
                  strokeWidth={isGoal ? 2.2 : 1.6}
                  filter={isGoal ? 'url(#f2-glow-goal)' : ev.isHome ? 'url(#f2-glow-home)' : 'url(#f2-glow-away)'}
                />

                {/* Ícono */}
                <text textAnchor="middle" dominantBaseline="central"
                  fontSize={isGoal ? 10 : 8}
                  style={{ userSelect: 'none', pointerEvents: 'none' }}>
                  {meta.icon}
                </text>

                {/* Minuto */}
                <text y={r + 8} textAnchor="middle"
                  fill={ev.color} fontSize="7" fontWeight="700"
                  fontFamily="Inter, Arial, sans-serif"
                  style={{ userSelect: 'none' }}>
                  {ev.minute != null ? `${ev.minute}'` : ''}
                </text>

                {/* Equipo (siempre visible en goles, en activo para el resto) */}
                {(isGoal || isActive) && (
                  <text y={r + 17} textAnchor="middle"
                    fill={ev.color} fontSize="6.5" fontWeight="600"
                    fontFamily="Inter, Arial, sans-serif"
                    style={{ userSelect: 'none' }}>
                    {ev.team.slice(0, 12)}
                  </text>
                )}

                {/* Jugador (solo activo o goles) */}
                {(isGoal || isActive) && ev.player && (
                  <text y={r + 26} textAnchor="middle"
                    fill="rgba(255,255,255,0.78)" fontSize="6.5"
                    fontFamily="Inter, Arial, sans-serif"
                    style={{ userSelect: 'none' }}>
                    {shortName(ev.player)}
                  </text>
                )}
              </g>
            )
          })}
```

### Procesamiento previo al render (líneas 157–186)

```javascript
  /* Procesar eventos */
  const processed = events.map(ev => {
    const home = isHomeEvent(ev, summary)
    return {
      ...ev,
      kind:   getEventKind(ev),
      isHome: home,
      zone:   eventZone(ev, home),
      color:  home ? HOME_COLOR : AWAY_COLOR,
      bg:     home ? HOME_BG    : AWAY_BG,
      team:   home ? homeTeam   : awayTeam,
    }
  })

  const timelineEvs = [...processed]
  // En campo: todos los eventos excepto cambios (no tienen ubicación táctica relevante)
  const fieldEvs = processed.filter(ev => ev.kind !== 'subst')

  /* Evento activo ciclado — muestra apellido + equipo del jugador activo */
  const [activeDot, setActiveDot] = useState(null)
  useEffect(() => {
    if (!fieldEvs.length) { setActiveDot(null); return }
    let i = fieldEvs.length - 1  // empieza por el más reciente
    setActiveDot(i)
    const interval = setInterval(() => {
      i = (i + 1) % fieldEvs.length
      setActiveDot(i)
    }, 2800)
    return () => clearInterval(interval)
  }, [events.length]) // eslint-disable-line
```

### Render SVG eventos (líneas 312–377)

```jsx
          {/* ── EVENTOS EN CAMPO ── */}
          {fieldEvs.map((ev, i) => {
            const meta     = KIND_META[ev.kind]
            const [cpx, cpy] = ev.zone
            // Convertir % de zona interior a coordenadas SVG
            const svgX = 14 + (cpx / 100) * (VW - 28)
            const svgY = 8  + (cpy / 100) * (VH - 16)
            const isActive = activeDot === i
            const isGoal   = ev.kind === 'goal'
            const r        = isGoal ? 12 : 9

            return (
              <g key={i} transform={`translate(${svgX},${svgY})`}>
                {/* Pulso animado */}
                {(isActive || isGoal) && (
                  <circle r={r + 6} fill={ev.color} opacity="0.13">
                    <animate attributeName="r"
                      values={`${r+2};${r+10};${r+2}`} dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity"
                      values="0.18;0.04;0.18" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Círculo del evento */}
                <circle r={r} fill={ev.bg} stroke={ev.color}
                  strokeWidth={isGoal ? 2.2 : 1.6}
                  filter={isGoal ? 'url(#f2-glow-goal)' : ev.isHome ? 'url(#f2-glow-home)' : 'url(#f2-glow-away)'}
                />

                {/* Ícono */}
                <text textAnchor="middle" dominantBaseline="central"
                  fontSize={isGoal ? 10 : 8}
                  style={{ userSelect: 'none', pointerEvents: 'none' }}>
                  {meta.icon}
                </text>

                {/* Minuto */}
                <text y={r + 8} textAnchor="middle"
                  fill={ev.color} fontSize="7" fontWeight="700"
                  fontFamily="Inter, Arial, sans-serif"
                  style={{ userSelect: 'none' }}>
                  {ev.minute != null ? `${ev.minute}'` : ''}
                </text>

                {/* Equipo (siempre visible en goles, en activo para el resto) */}
                {(isGoal || isActive) && (
                  <text y={r + 17} textAnchor="middle"
                    fill={ev.color} fontSize="6.5" fontWeight="600"
                    fontFamily="Inter, Arial, sans-serif"
                    style={{ userSelect: 'none' }}>
                    {ev.team.slice(0, 12)}
                  </text>
                )}

                {/* Jugador (solo activo o goles) */}
                {(isGoal || isActive) && ev.player && (
                  <text y={r + 26} textAnchor="middle"
                    fill="rgba(255,255,255,0.78)" fontSize="6.5"
                    fontFamily="Inter, Arial, sans-serif"
                    style={{ userSelect: 'none' }}>
                    {shortName(ev.player)}
                  </text>
                )}
              </g>
            )
          })}
```
