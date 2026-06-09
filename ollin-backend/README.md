# Ollin Deportes — Backend

Servicio Node.js para polling de API-Sports (fútbol + béisbol), caché en Redis y actualizaciones en tiempo real vía Socket.io.

## Stack

- Node.js + Express
- Socket.io
- Redis (`ioredis`)
- axios → API-Football + API-Baseball

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores:

| Variable | Descripción |
|----------|-------------|
| `API_SPORTS_KEY` | Key de API-Sports (misma del VPS) |
| `REDIS_URL` | URL Redis, ej. `redis://localhost:6379` |
| `POLLING_INTERVAL_MS` | Intervalo de polling (default `600000` = 10 min, plan FREE) |
| `OLLIN_PORT` | Puerto del servicio (default `10001`) — **nunca usar 10000** |

## Arranque

```bash
cd ollin-backend
npm install
cp .env.example .env
# Editar .env con API_SPORTS_KEY real
npm start
```

## Endpoints (solo leen Redis)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/fixtures/live` | Partidos en vivo (fútbol + béisbol MLB) |
| GET | `/fixtures/hoy` | Partidos de hoy |
| GET | `/fixtures/proximos` | Fútbol próximos 3 días |
| GET | `/health` | Estado del servicio |

En producción, Nginx expone estos bajo `https://jeeljel.com/api/ollin/` (configuración pendiente).

## Socket.io

Tras cada ciclo de polling exitoso emite:

```js
{ deporte: 'futbol' | 'beisbol', tipo: 'live' | 'hoy' | 'proximos', data: [...], at: ISO8601 }
```

CORS permitido: `https://jeeljel.com`, `http://localhost:5173`

## Polling y límites FREE

- Fútbol: 1× `/fixtures?live=all` + 4× `/fixtures?date=` (hoy + 3 días) por ciclo
- Béisbol: 1× `/games?date=HOY` (MLB) por ciclo
- Contador diario en Redis `ollin:api:requests:YYYY-MM-DD`
- Al alcanzar **95 requests/día**, el polling se pausa hasta el día siguiente

## Claves Redis

- `ollin:futbol:live`
- `ollin:futbol:hoy`
- `ollin:futbol:proximos`
- `ollin:beisbol:hoy`

TTL = 2 × `POLLING_INTERVAL_MS`

## Chat en vivo — moderación

El filtro corre **solo en backend** antes de insertar en Supabase.

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/chat/messages` | POST | Publicar mensaje (filtrado + anti-spam + reincidencia) |
| `/chat/status` | GET | Estado mute/ban del usuario o IP |

Body POST `/chat/messages`:
```json
{
  "matchId": "12345",
  "message": "texto",
  "userId": "uuid-opcional",
  "displayName": "Aficionado_4821"
}
```

Respuesta bloqueada (422):
```json
{
  "ok": false,
  "blocked": true,
  "userMessage": "Tu mensaje no fue enviado. En Ollin Deportes fomentamos la convivencia sana — sin insultos ni discriminación."
}
```

**Archivos:**
- `src/lib/chatFilter.terms.js` — listas editables
- `src/lib/chatFilter.js` — normalización anti-evasión + evaluación
- `src/lib/chatModeration.js` — reincidencia (Redis): 3 bloqueos/10 min → mute 15 min; 3 mutes/día → ban 24 h
- `docs/chat-schema.sql` — tablas `ollin_chat` y `ollin_chat_moderacion`

Variables `.env`: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`

## Cumplimiento legal

Antes de escribir UI o respuestas API, leer `src/lib/compliance.js` y `src/lib/sanitize.js`.

- Prohibido en textos públicos: FIFA, World Cup, Copa del Mundo, Mundial 2026, etc.
- Redis solo almacena datos sanitizados (sin logos oficiales; `team.display` con bandera o iniciales)
- Campo 2D siempre SVG propio — sin video/audio/clips
- Afiliados: «Momios en vivo», «Modo Apostador» únicamente
