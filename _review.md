# Inventario Ollin Deportes — Migración a repo separado
**Repo:** `jeeljel-web` | **Fecha:** 15/06/2026

---

## 1. `src/components/ollin/` — todos los archivos

### Raíz (`src/components/ollin/`)

**`src/components/ollin/OllinLayout.jsx`**
- `./OllinLegalDisclaimer`
- `../../ollin/compliance` → `sanitizeOllinText`

**`src/components/ollin/OllinLegalDisclaimer.jsx`**
- `../../ollin/compliance` → `OLLIN_LEGAL_DISCLAIMER`

**`src/components/ollin/OllinChat.jsx`**
- `react-router-dom` → `Link`, `useLocation`
- `../../lib/supabaseClient` → `supabase`

**`src/components/ollin/LeagueSidebar.jsx`**
- `../../ollin/leagueCatalog` → `getLeagueLabel`, `getLeaguesByRegion`, `PREMIUM_LOCK_MESSAGE`, `SPORTS_NAV`
- `./PremiumLockNotice`

**`src/components/ollin/PremiumLockNotice.jsx`**
- `../../ollin/leagueCatalog` → `PREMIUM_LOCK_MESSAGE`

**`src/components/ollin/StandingsView.jsx`**
- `./PremiumLockNotice`
- `../../ollin/standingsLabels` → `formatStandingsGroupTitle`
- `../../ollin/teamDisplay` → `translateTeamName`

**`src/components/ollin/MatchCardCompact.jsx`**
- `react-router-dom` → `Link`
- `../../ollin/matchUtils` → `formatMatchDateTime`
- `../../ollin/teamDisplay` → `translateTeamName`
- `./TeamDisplay`

**`src/components/ollin/MatchCard.jsx`**
- `react-router-dom` → `Link`
- `../../ollin/matchUtils` → `formatMatchDateTime`
- `../../ollin/teamDisplay` → `translateTeamName`
- `./TeamDisplay`

**`src/components/ollin/MatchGroupList.jsx`**
- `./MatchCardCompact`

**`src/components/ollin/MatchColumn.jsx`**
- `./MatchCard`

**`src/components/ollin/TeamDisplay.jsx`**
- `../../ollin/teamDisplay` → `buildTeamDisplay`

### Tabs (`src/components/ollin/tabs/`)

**`src/components/ollin/tabs/TabEnVivo.jsx`**
- `react-router-dom` → `Link`
- `../../../hooks/useTabData`
- `../../../hooks/useSocketUpdate`
- `../TeamDisplay`
- `../../../ollin/matchUtils` → `filterBySport`, `filterByLeague`, `filterBySearch`, `groupMatchesByLeague`, `normalizeFootballFixture`, `getMatchTime` (varios)

**`src/components/ollin/tabs/TabHoy.jsx`**
- `../../../hooks/useTabData`
- `../MatchGroupList`
- `../../../ollin/matchUtils` → `normalizeFootballFixture`, `filterBySport`, `filterByLeague`, `filterBySearch`, `groupMatchesByLeague`

**`src/components/ollin/tabs/TabProximos.jsx`**
- `../../../hooks/useTabData`
- `../MatchGroupList`
- `../../../ollin/matchUtils` → `normalizeFootballFixture`, `filterBySport`, `filterByLeague`, `filterBySearch`, `groupMatchesByLeague`

**`src/components/ollin/tabs/TabPasados.jsx`**
- `../../../hooks/useTabData`
- `../MatchGroupList`
- `../../../ollin/matchUtils` → `normalizeFootballFixture`, `filterBySport`, `filterByLeague`, `filterBySearch`, `groupMatchesByLeague`

### Partido (`src/components/ollin/partido/`)

**`src/components/ollin/partido/FootballFieldLive.jsx`**
- `../../../hooks/useTickerEvents`
- `./LiveTicker`

**`src/components/ollin/partido/PartidoHeader.jsx`**
- Solo hooks de React (`useEffect`, `useState`) — sin imports de proyecto

**`src/components/ollin/partido/LiveTicker.jsx`**
- Solo hooks de React (`useEffect`, `useState`) — sin imports de proyecto

**`src/components/ollin/partido/ChatPartido.jsx`**
- `socket.io-client` → `io`
- `../../../lib/supabaseClient` → `supabase`

**`src/components/ollin/partido/PlayersTab.jsx`**
- Solo hooks de React (`useMemo`, `useState`) — sin imports de proyecto

**`src/components/ollin/partido/LineupsTab.jsx`**
- Solo hooks de React (`useState`) — sin imports de proyecto

**`src/components/ollin/partido/StatsTab.jsx`**
- Sin imports

**`src/components/ollin/partido/H2HTab.jsx`**
- Sin imports

**`src/components/ollin/partido/BaseballDiamondLive.jsx`**
- Sin imports

**`src/components/ollin/partido/PartidoSkeleton.jsx`**
- Sin imports

---

## 2. Páginas en `src/pages/` que pertenecen a Ollin

**`src/pages/OllinDeportes.jsx`**
- `./OllinDeportes.css`
- `../components/ollin/LeagueSidebar`
- `../components/ollin/StandingsView`
- `../components/ollin/OllinLayout`
- `../components/ollin/tabs/TabEnVivo`
- `../components/ollin/tabs/TabHoy`
- `../components/ollin/tabs/TabProximos`
- `../components/ollin/tabs/TabPasados`
- `../hooks/useStandings`
- `../ollin/leagueCatalog` → `CENTRAL_TABS`, `getLeagueMeta`
- `../assets/Logo_JeelJel_Kanaabcon_balon_sin_fondo.png`
- `../assets/mosaicos/Macuilxochitl.png`

**`src/pages/OllinPartido.jsx`**
- `./OllinDeportes.css`
- `react-router-dom` → `Link`, `useParams`
- `../components/ollin/OllinLayout`
- `../components/ollin/partido/PartidoHeader`
- `../components/ollin/partido/PartidoSkeleton`
- `../components/ollin/partido/FootballFieldLive`
- `../components/ollin/partido/BaseballDiamondLive`
- `../components/ollin/partido/StatsTab`
- `../components/ollin/partido/PlayersTab`
- `../components/ollin/partido/LineupsTab`
- `../components/ollin/partido/H2HTab`
- `../components/ollin/partido/ChatPartido`
- `../hooks/usePartido`
- `../ollin/partidoMock` → `resolveSport`
- `../assets/mosaicos/Macuilxochitl.png`

**`src/pages/OllinDeportes.css`**
- CSS global de todos los componentes Ollin (2 180 líneas)
- Importado tanto por `OllinDeportes.jsx` como por `OllinPartido.jsx`

---

## 3. Hooks en `src/hooks/` usados por Ollin

**`src/hooks/useOllinData.js`**
- `socket.io-client` → `io`
- `../ollin/mockData` → `MOCK_MATCHES`
- `../ollin/matchUtils` → `categorizeApiData`
- ✅ Exclusivo Ollin

**`src/hooks/usePartido.js`**
- `socket.io-client` → `io`
- ✅ Exclusivo Ollin

**`src/hooks/useTabData.js`**
- Solo hooks de React (`useCallback`, `useEffect`, `useState`)
- ✅ Exclusivo Ollin

**`src/hooks/useSocketUpdate.js`**
- `socket.io-client` → `io`
- ✅ Exclusivo Ollin

**`src/hooks/useStandings.js`**
- `../ollin/mockData` → `MOCK_STANDINGS`, `MOCK_SCORERS`
- ✅ Exclusivo Ollin

**`src/hooks/useTickerEvents.js`**
- `socket.io-client` → `io`
- ✅ Exclusivo Ollin

**`src/hooks/useTypewriter.js`**
- Solo hooks de React (`useEffect`, `useRef`)
- ⚠️ Compartido — también usado en `Home.jsx`, `Mision.jsx` y otras páginas del sitio principal

---

## 4. Archivos `src/` (lib / utils / config) importados por Ollin

**`src/ollin/compliance.js`**
- Sin imports de proyecto
- Exporta: `OLLIN_LEGAL_DISCLAIMER`, `sanitizeOllinText`, `getLeagueDisplayName`, `BANNED_REPLACEMENTS`

**`src/ollin/leagueCatalog.js`**
- `./compliance` → `getLeagueDisplayName`
- Exporta: `LEAGUE_CATALOG`, `SPORTS_NAV`, `CENTRAL_TABS`, `PREMIUM_LOCK_MESSAGE`, `getLeagueLabel`, `getLeaguesByRegion`, `getLeagueMeta`

**`src/ollin/teamDisplay.js`**
- Sin imports de proyecto (usa CDN externo `https://flagcdn.com`)
- Exporta: `translateTeamName`, `buildTeamDisplay`

**`src/ollin/matchUtils.js`**
- `./compliance` → `getLeagueDisplayName`
- `./teamDisplay` → `translateTeamName`
- Exporta: `normalizeFootballFixture`, `categorizeApiData`, `formatMatchDateTime`, `formatMatchDate`, `filterBySport`, `filterByLeague`, `filterBySearch`, `groupMatchesByLeague`

**`src/ollin/standingsLabels.js`**
- Sin imports de proyecto
- Exporta: `formatStandingsGroupTitle`

**`src/ollin/mockData.js`**
- Sin imports de proyecto
- Exporta: `MOCK_MATCHES`, `MOCK_STANDINGS`, `MOCK_SCORERS`

**`src/ollin/partidoMock.js`**
- Sin imports de proyecto
- Exporta: `resolveSport`, datos demo partido

**`src/lib/supabaseClient.js`**
- `@supabase/supabase-js` → `createClient`
- ⚠️ **Compartido con el resto del sitio** (`Registro.jsx`, `Navbar.jsx`, `Login.jsx`)
- Credenciales actualmente hardcodeadas (ver sección 8)

---

## 5. Assets / imágenes usados por Ollin

| Asset | Ruta | Usado en |
|-------|------|----------|
| Logo balón | `src/assets/Logo_JeelJel_Kanaabcon_balon_sin_fondo.png` | `OllinDeportes.jsx` (header) |
| Mosaico Macuilxochitl | `src/assets/mosaicos/Macuilxochitl.png` | `OllinDeportes.jsx`, `OllinPartido.jsx` (fondo) |

> El banner en `OllinPartido.jsx` enlaza a `https://ikannaat.jeeljel.com` como URL externa de texto — no importa ningún asset local de Ikan Naat.

---

## 6. Registro de rutas `/ollin-deportes` en el router

**Archivo:** `src/App.jsx`

```jsx
// src/App.jsx — líneas 26-29
<Route path="/ollin-deportes"             element={<OllinDeportes />} />
<Route path="/ollin-deportes/partido/:id" element={<OllinPartido />} />
<Route path="/mundial-2026"               element={<Navigate to="/ollin-deportes" replace />} />
<Route path="/mundial-2026/*"             element={<Navigate to="/ollin-deportes" replace />} />
```

Componentes cargados:
- `/ollin-deportes` → `src/pages/OllinDeportes.jsx`
- `/ollin-deportes/partido/:id` → `src/pages/OllinPartido.jsx`

El router vive dentro de `<BrowserRouter>` junto con `<Navbar />` y `<Footer />` del sitio jeeljel.com.
En el repo nuevo habrá que crear su propio `App.jsx` con router independiente.

---

## 7. Contenido completo de `package.json`

### Frontend — `package.json` (raíz del repo)

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

> Dependencias mínimas para Ollin: `react`, `react-dom`, `react-router-dom`, `socket.io-client`, `@supabase/supabase-js`.
> `animejs` no es usada por ningún componente Ollin — puede omitirse en el repo nuevo.

### Backend — `ollin-backend/package.json`

```json
{
  "name": "ollin-backend",
  "version": "1.0.0",
  "description": "Backend Ollin Deportes — API-Sports polling, Redis cache, Socket.io",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js"
  },
  "engines": {
    "node": ">=18"
  },
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

## 8. Variables de entorno usadas por los componentes Ollin

### Frontend

**Ningún componente Ollin usa `import.meta.env`.**

Las credenciales de Supabase están **hardcodeadas** en `src/lib/supabaseClient.js`:

```js
// src/lib/supabaseClient.js
export const supabase = createClient(
  'https://uttyhtgevtoaaivefcor.supabase.co',       // URL proyecto ikan-nat-prod
  'sb_publishable_Raqzheiq6W9DTSv8A79Deg_srSX1XzB'  // anon/publishable key (segura en frontend)
)
```

⚠️ **Al migrar al repo nuevo:** mover a variables de entorno Vite:
```
VITE_SUPABASE_URL=https://uttyhtgevtoaaivefcor.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

El proxy de desarrollo (dev only) está en `vite.config.js`:
```js
'/api/ollin' → 'http://localhost:10001'   // rewrite: quita /api/ollin del path
'/socket.io' → 'http://localhost:10001'   // ws: true
```
En producción, Nginx hace el mismo proxy al puerto 10001.

### Backend — `ollin-backend/.env` (en VPS, nunca en repo)

```bash
API_SPORTS_KEY=          # API-Sports plan PRO — 7 500 req/día
REDIS_URL=redis://localhost:6379
POLLING_INTERVAL_MS=180000   # fallback idle 3 min; polling inteligente 15 s en código
OLLIN_PORT=10001             # NUNCA 10000 (reservado Ikan Naat)
SUPABASE_URL=               # proyecto ikan-nat-prod
SUPABASE_SERVICE_KEY=       # service role (solo backend, nunca frontend)
```

Plantilla disponible en `ollin-backend/.env.example`.
