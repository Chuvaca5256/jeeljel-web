# Inventario Ollin Deportes — Migración a repo separado
**Generado:** 15/06/2026 | **Repo origen:** `jeeljel-web`

---

## 1. Componentes — `src/components/ollin/`

| Archivo | Imports directos |
|---------|-----------------|
| `src/components/ollin/OllinLayout.jsx` | `./OllinLegalDisclaimer`, `../../ollin/compliance` (`sanitizeOllinText`) |
| `src/components/ollin/OllinLegalDisclaimer.jsx` | `../../ollin/compliance` (`OLLIN_LEGAL_DISCLAIMER`) |
| `src/components/ollin/OllinChat.jsx` | `react-router-dom` (`Link`, `useLocation`), `../../lib/supabaseClient` (`supabase`) |
| `src/components/ollin/LeagueSidebar.jsx` | `../../ollin/leagueCatalog` (`getLeagueLabel`, `getLeaguesByRegion`, `PREMIUM_LOCK_MESSAGE`, `SPORTS_NAV`), `./PremiumLockNotice` |
| `src/components/ollin/PremiumLockNotice.jsx` | `../../ollin/leagueCatalog` (`PREMIUM_LOCK_MESSAGE`) |
| `src/components/ollin/StandingsView.jsx` | `./PremiumLockNotice`, `../../ollin/standingsLabels` (`formatStandingsGroupTitle`), `../../ollin/teamDisplay` (`translateTeamName`) |
| `src/components/ollin/MatchCardCompact.jsx` | `react-router-dom` (`Link`), `../../ollin/matchUtils` (`formatMatchDateTime`), `../../ollin/teamDisplay` (`translateTeamName`), `./TeamDisplay` |
| `src/components/ollin/MatchCard.jsx` | `react-router-dom` (`Link`), `../../ollin/matchUtils` (`formatMatchDateTime`), `../../ollin/teamDisplay` (`translateTeamName`), `./TeamDisplay` |
| `src/components/ollin/MatchGroupList.jsx` | `./MatchCardCompact` |
| `src/components/ollin/MatchColumn.jsx` | `./MatchCard` |
| `src/components/ollin/TeamDisplay.jsx` | `../../ollin/teamDisplay` (`buildTeamDisplay`) |
| `src/components/ollin/tabs/TabEnVivo.jsx` | `react-router-dom` (`Link`), `../../../hooks/useTabData`, `../../../hooks/useSocketUpdate`, `../TeamDisplay`, `../../../ollin/matchUtils` (varias funciones) |
| `src/components/ollin/tabs/TabHoy.jsx` | `../../../hooks/useTabData`, `../MatchGroupList`, `../../../ollin/matchUtils` (`normalizeFootballFixture`, `filterBySport`, `filterByLeague`, `filterBySearch`, `groupMatchesByLeague`) |
| `src/components/ollin/tabs/TabProximos.jsx` | `../../../hooks/useTabData`, `../MatchGroupList`, `../../../ollin/matchUtils` (mismas 5 funciones) |
| `src/components/ollin/tabs/TabPasados.jsx` | `../../../hooks/useTabData`, `../MatchGroupList`, `../../../ollin/matchUtils` (mismas 5 funciones) |
| `src/components/ollin/partido/FootballFieldLive.jsx` | `../../../hooks/useTickerEvents`, `./LiveTicker` — **sin imports externos adicionales** |
| `src/components/ollin/partido/PartidoHeader.jsx` | Solo `react` hooks — **sin imports externos** |
| `src/components/ollin/partido/LiveTicker.jsx` | Solo `react` hooks — **sin imports externos** |
| `src/components/ollin/partido/ChatPartido.jsx` | `socket.io-client` (`io`), `../../../lib/supabaseClient` (`supabase`) |
| `src/components/ollin/partido/PlayersTab.jsx` | Solo `react` hooks — **sin imports externos** |
| `src/components/ollin/partido/LineupsTab.jsx` | Solo `react` hooks — **sin imports externos** |
| `src/components/ollin/partido/StatsTab.jsx` | Sin imports — **puro JSX** |
| `src/components/ollin/partido/H2HTab.jsx` | Sin imports — **puro JSX** |
| `src/components/ollin/partido/BaseballDiamondLive.jsx` | Sin imports — **puro JSX SVG** |
| `src/components/ollin/partido/PartidoSkeleton.jsx` | Sin imports — **puro JSX** |

---

## 2. Páginas — `src/pages/`

| Archivo | Imports directos |
|---------|-----------------|
| `src/pages/OllinDeportes.jsx` | `./OllinDeportes.css`, `../components/ollin/LeagueSidebar`, `../components/ollin/StandingsView`, `../components/ollin/OllinLayout`, `../components/ollin/tabs/TabEnVivo`, `../components/ollin/tabs/TabHoy`, `../components/ollin/tabs/TabProximos`, `../components/ollin/tabs/TabPasados`, `../hooks/useStandings`, `../ollin/leagueCatalog` (`CENTRAL_TABS`, `getLeagueMeta`), `../assets/Logo_JeelJel_Kanaabcon_balon_sin_fondo.png`, `../assets/mosaicos/Macuilxochitl.png` |
| `src/pages/OllinPartido.jsx` | `react-router-dom` (`Link`, `useParams`), `../components/ollin/OllinLayout`, `../components/ollin/partido/PartidoHeader`, `../components/ollin/partido/PartidoSkeleton`, `../components/ollin/partido/FootballFieldLive`, `../components/ollin/partido/BaseballDiamondLive`, `../components/ollin/partido/StatsTab`, `../components/ollin/partido/PlayersTab`, `../components/ollin/partido/LineupsTab`, `../components/ollin/partido/H2HTab`, `../hooks/usePartido`, `../components/ollin/partido/ChatPartido`, `../ollin/partidoMock` (`resolveSport`), `../assets/mosaicos/Macuilxochitl.png`, `./OllinDeportes.css` |
| `src/pages/OllinDeportes.css` | CSS global de todos los componentes Ollin — **requerido por ambas páginas** |

---

## 3. Hooks — `src/hooks/` — uso exclusivo Ollin

| Hook | Imports directos | ¿Exclusivo Ollin? |
|------|-----------------|-------------------|
| `src/hooks/useOllinData.js` | `socket.io-client` (`io`), `../ollin/mockData` (`MOCK_MATCHES`), `../ollin/matchUtils` (`categorizeApiData`) | ✅ Sí |
| `src/hooks/usePartido.js` | `socket.io-client` (`io`) | ✅ Sí |
| `src/hooks/useTabData.js` | Solo `react` hooks | ✅ Sí |
| `src/hooks/useSocketUpdate.js` | `socket.io-client` (`io`) | ✅ Sí |
| `src/hooks/useStandings.js` | `../ollin/mockData` (`MOCK_STANDINGS`, `MOCK_SCORERS`) | ✅ Sí |
| `src/hooks/useTickerEvents.js` | `socket.io-client` (`io`) | ✅ Sí |
| `src/hooks/useTypewriter.js` | Solo `react` hooks | ⚠️ Compartido — también usado en `Home.jsx`, `Mision.jsx`, etc. |

---

## 4. Utils / lib / config — `src/ollin/` y `src/lib/`

| Archivo | Imports directos | Notas |
|---------|-----------------|-------|
| `src/ollin/leagueCatalog.js` | `./compliance` (`getLeagueDisplayName`) | Catálogo ~50 ligas, SPORTS_NAV, CENTRAL_TABS, PREMIUM_LOCK_MESSAGE |
| `src/ollin/teamDisplay.js` | Sin imports externos | Mapas de nombres, banderas (flagcdn CDN), colores de clubs |
| `src/ollin/matchUtils.js` | `./compliance` (`getLeagueDisplayName`), `./teamDisplay` (`translateTeamName`) | normalizeFootballFixture, categorizeApiData, formatMatchDateTime, groupMatchesByLeague, filtros |
| `src/ollin/compliance.js` | Sin imports | OLLIN_LEGAL_DISCLAIMER, sanitizeOllinText, BANNED_REPLACEMENTS, getLeagueDisplayName |
| `src/ollin/standingsLabels.js` | Sin imports | Traducciones grupos standings (EN → ES) |
| `src/ollin/mockData.js` | Sin imports | Datos demo cuando backend no disponible |
| `src/ollin/partidoMock.js` | Sin imports | Demo partido individual; exporta `resolveSport` |
| `src/lib/supabaseClient.js` | `@supabase/supabase-js` (`createClient`) | ⚠️ **Compartido con el resto del sitio** (`Registro.jsx`, `Navbar.jsx`). Contiene URL + anon key hardcodeada. En el repo nuevo deberá usar variables de entorno. |

---

## 5. Assets / Imágenes

### Usados directamente por Ollin

| Asset | Usado en | Descripción |
|-------|----------|-------------|
| `src/assets/Logo_JeelJel_Kanaabcon_balon_sin_fondo.png` | `OllinDeportes.jsx` | Logo header Ollin |
| `src/assets/mosaicos/Macuilxochitl.png` | `OllinDeportes.jsx`, `OllinPartido.jsx` | Fondo mosaico de ambas páginas Ollin |

### Todos los assets disponibles (para referencia)

```
src/assets/
├── ajolote_final.webm
├── hero.png
├── Logo_Ika_Naat_sin_fondo_sin_letras.png
├── Logo_inkognito_sin_fondo.png
├── Logo_Izydra_OS_Sin_fondo.png
├── Logo_JeelJel_con_balon.png
├── Logo_JeelJel_Kanaabcon_balon_sin_fondo.png   ← MIGRAR
├── Logo_JeelJel_sin_fondo.png
├── Logo_virtyou_sin_fondo.png
├── react.svg
├── vite.svg
└── mosaicos/
    ├── Cuculcan.png
    ├── Dios.png
    ├── Dios_2.png
    ├── Dios_3.png
    ├── Dios_Tupa.png
    ├── Macuilxochitl.png                         ← MIGRAR
    ├── Tlaloc.png
    └── Viracoch.png
```

> **Nota:** El banner en `OllinPartido.jsx` enlaza a `https://ikannaat.jeeljel.com` como URL externa (no importa asset).

---

## 6. Registro de rutas — `src/App.jsx`

```jsx
// src/App.jsx — líneas 26-29
<Route path="/ollin-deportes"                  element={<OllinDeportes />} />
<Route path="/ollin-deportes/partido/:id"      element={<OllinPartido />} />
<Route path="/mundial-2026"                    element={<Navigate to="/ollin-deportes" replace />} />
<Route path="/mundial-2026/*"                  element={<Navigate to="/ollin-deportes" replace />} />
```

Los componentes `Navbar` y `Footer` del sitio jeeljel.com envuelven las páginas.
En el repo nuevo habrá que crear su propio `App.jsx` / router raíz.

---

## 7. `package.json` — Frontend (`jeeljel-web`)

```json
{
  "name": "jeeljel-web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.108.1",
    "animejs": "^4.4.1",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-router-dom": "^7.15.1",
    "socket.io-client": "^4.8.1"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.5.0",
    "eslint": "^10.3.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.6.0",
    "postcss": "^8.5.15",
    "tailwindcss": "^3.4.19",
    "vite": "^8.0.12"
  }
}
```

> **Dependencias mínimas para Ollin:** `react`, `react-dom`, `react-router-dom`, `socket.io-client`, `@supabase/supabase-js`.
> `animejs` no es usada por Ollin directamente — revisar si se puede omitir en el repo nuevo.

### `package.json` — Backend (`ollin-backend/`)

```json
{
  "name": "ollin-backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "engines": { "node": ">=18" },
  "dependencies": {
    "@supabase/supabase-js": "^2.49.8",
    "axios": "^1.9.0",
    "dotenv": "^16.5.0",
    "express": "^4.21.2",
    "ioredis": "^5.6.1",
    "socket.io": "^4.8.1",
    "ws": "^8.21.0"
  }
}
```

---

## 8. Variables de entorno

### Frontend (`src/`)

**No se usa `import.meta.env` en ningún componente Ollin.**
Las credenciales están hardcodeadas en `src/lib/supabaseClient.js`:

```js
// src/lib/supabaseClient.js
export const supabase = createClient(
  'https://uttyhtgevtoaaivefcor.supabase.co',  // ← hardcoded
  'sb_publishable_Raqzheiq6W9DTSv8A79Deg_srSX1XzB'  // ← hardcoded (anon/publishable key)
)
```

⚠️ **Acción requerida al migrar:** mover a `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `.env`.

El proxy dev server está configurado en `vite.config.js`:

```js
// vite.config.js — proxy dev local
'/api/ollin' → 'http://localhost:10001'   (rewrite: quita /api/ollin del path)
'/socket.io' → 'http://localhost:10001'   (ws: true)
```

En producción, Nginx redirige `/api/ollin/` y `/socket.io/` al backend `:10001`.

### Backend (`ollin-backend/.env.example`)

```bash
API_SPORTS_KEY=          # API-Sports — plan PRO activo, 7500 req/día
REDIS_URL=redis://localhost:6379
POLLING_INTERVAL_MS=600000   # fallback idle; polling inteligente 15s live en código
OLLIN_PORT=10001             # NUNCA 10000 (Ikan Naat)
SUPABASE_URL=               # proyecto ikan-nat-prod
SUPABASE_SERVICE_KEY=       # service role (solo backend)
```

---

## Resumen para migración

### Árbol completo a mover al nuevo repo

```
ollin-deportes-web/
├── package.json                         (nuevo, basado en jeeljel-web)
├── vite.config.js                       (copiar con proxy /api/ollin y /socket.io)
├── tailwind.config.js                   (copiar del repo actual)
├── postcss.config.js                    (copiar)
├── index.html                           (nuevo, apuntar a main.jsx)
├── .env                                 (nuevo — VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
└── src/
    ├── main.jsx                         (nuevo)
    ├── App.jsx                          (nuevo — solo rutas /ollin-deportes)
    ├── lib/
    │   └── supabaseClient.js            (copiar — migrar a import.meta.env)
    ├── ollin/
    │   ├── compliance.js
    │   ├── leagueCatalog.js
    │   ├── matchUtils.js
    │   ├── mockData.js
    │   ├── partidoMock.js
    │   ├── standingsLabels.js
    │   └── teamDisplay.js
    ├── hooks/
    │   ├── useOllinData.js
    │   ├── usePartido.js
    │   ├── useSocketUpdate.js
    │   ├── useStandings.js
    │   ├── useTabData.js
    │   └── useTickerEvents.js
    │   (useTypewriter.js — evaluar si se necesita)
    ├── pages/
    │   ├── OllinDeportes.jsx
    │   ├── OllinDeportes.css            (CSS global de todos los componentes Ollin)
    │   └── OllinPartido.jsx
    ├── components/ollin/
    │   ├── LeagueSidebar.jsx
    │   ├── MatchCard.jsx
    │   ├── MatchCardCompact.jsx
    │   ├── MatchColumn.jsx
    │   ├── MatchGroupList.jsx
    │   ├── OllinChat.jsx
    │   ├── OllinLayout.jsx
    │   ├── OllinLegalDisclaimer.jsx
    │   ├── PremiumLockNotice.jsx
    │   ├── StandingsView.jsx
    │   ├── TeamDisplay.jsx
    │   ├── tabs/
    │   │   ├── TabEnVivo.jsx
    │   │   ├── TabHoy.jsx
    │   │   ├── TabPasados.jsx
    │   │   └── TabProximos.jsx
    │   └── partido/
    │       ├── BaseballDiamondLive.jsx
    │       ├── ChatPartido.jsx
    │       ├── FootballFieldLive.jsx
    │       ├── H2HTab.jsx
    │       ├── LineupsTab.jsx
    │       ├── LiveTicker.jsx
    │       ├── PartidoHeader.jsx
    │       ├── PartidoSkeleton.jsx
    │       ├── PlayersTab.jsx
    │       └── StatsTab.jsx
    └── assets/
        ├── Logo_JeelJel_Kanaabcon_balon_sin_fondo.png
        └── mosaicos/
            └── Macuilxochitl.png

ollin-backend/                           (mover íntegro — ya es carpeta independiente)
├── package.json
├── .env.example
├── docs/
│   └── chat-schema.sql
└── src/
    ├── server.js
    ├── config/
    │   ├── env.js
    │   └── leagues.js
    ├── lib/
    │   ├── chatFilter.js
    │   ├── chatFilter.terms.js
    │   ├── chatModeration.js
    │   ├── compliance.js
    │   ├── dates.js
    │   ├── redis.js
    │   ├── requestCounter.js
    │   └── sanitize.js
    ├── routes/
    │   ├── chat.js
    │   ├── fixtures.js
    │   ├── partido.js
    │   └── standings.js
    └── services/
        ├── apiClient.js
        ├── baseballPolling.js
        ├── chatService.js
        ├── footballPolling.js
        ├── partidoService.js
        ├── pasadosService.js
        ├── polling.js
        ├── standingsService.js
        ├── statsDiffService.js
        └── supabaseClient.js
```

### Dependencias cruzadas con jeeljel.com que hay que resolver

| Dependencia | Tipo | Acción al migrar |
|-------------|------|-----------------|
| `src/lib/supabaseClient.js` | Compartida con `Registro.jsx`, `Navbar.jsx` | Copiar al repo nuevo; migrar credenciales a `import.meta.env` |
| `src/hooks/useTypewriter.js` | También usado en `Home.jsx`, `Mision.jsx` | Copiar si se necesita en Ollin (no evidente en el inventario) |
| `Navbar` / `Footer` de jeeljel.com | Componentes del sitio principal | Crear navbar/footer propios para el repo Ollin |
| `react-router-dom` `<Link>` | Dentro de `MatchCardCompact`, `MatchCard`, `TabEnVivo` | Las rutas apuntan a `/ollin-deportes/partido/:id` — funcionan igual en el repo nuevo |
| `OllinDeportes.css` | Importado tanto por `OllinDeportes.jsx` como por `OllinPartido.jsx` | Copiar una sola vez; ambas páginas lo importan |

### Lo que NO hay que migrar (queda en jeeljel.com)

- `src/components/Navbar.jsx`, `Footer.jsx`, `ScrollToTop.jsx`
- `src/pages/Home.jsx`, `Apps.jsx`, `Mision.jsx`, `Organizaciones.jsx`, etc.
- `src/assets/mosaicos/` (excepto `Macuilxochitl.png`)
- `src/assets/Logo_*.png` (excepto `Logo_JeelJel_Kanaabcon_balon_sin_fondo.png`)
- Rutas `/`, `/apps`, `/mision`, `/organizaciones`, `/registro`, `/login`, etc.
