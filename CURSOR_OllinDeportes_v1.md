# CURSOR — Ollin Deportes: Reglas, Arquitectura e Instrucciones v1.0
## JeelJel Kaanab | DOC-JEL-2026-OLLIN-001 | 09/06/2026

---

## 1. QUÉ ES OLLIN DEPORTES

Ollin Deportes es el hub deportivo en tiempo real de JeelJel Kaanab. Vive en `jeeljel.com/ollin-deportes`. Es un producto **independiente** de Ikan Naat IA — no es un agente dentro de Ikan Naat.

**Objetivo principal:** Que cualquier persona pueda seguir partidos en vivo con estadísticas granulares, al estilo de casas de apuestas como Bet365 y Caliente, desde la web de JeelJel Kaanab — sin pagar, sin registrarse.

**Objetivo secundario:** Funcionar como funnel de adquisición orgánico para todo el ecosistema JeelJel Kaanab. El usuario ve el partido, ve las marcas, eventualmente se registra en Ikan Naat u otras apps.

---

## 2. ARQUITECTURA GENERAL

### Stack
- **Frontend:** React + Vite + Tailwind (mismo repo `jeeljel-web`)
- **Backend:** Node.js + Express — puerto **10001** (NUNCA el 10000, ese es Ikan Naat)
- **Caché:** Redis — todos los datos de la API se cachean en Redis, los usuarios nunca golpean la API directamente
- **Tiempo real:** Socket.io — el backend emite eventos a los clientes conectados
- **Chat en vivo:** Supabase (tabla `ollin_chat`)
- **API de datos:** API-Football / API-Sports (`API_SPORTS_KEY` del VPS)

### Flujo de datos
```
API-Football → Backend Node.js (polling) → Redis (caché) → Socket.io → Frontend React
```

### Reglas de oro de arquitectura
- **NUNCA** hacer polling desde el frontend directamente a API-Football
- **SIEMPRE** el frontend recibe datos vía Socket.io desde el backend
- **NUNCA** exponer la `API_SPORTS_KEY` en el frontend
- El backend es el único que habla con API-Football
- Redis es la fuente de verdad en tiempo real — si Redis tiene el dato, no se consulta la API

---

## 3. INTERVALOS DE POLLING POR PLAN

| Plan API | Intervalo polling | Uso estimado/día (4 partidos simultáneos) |
|----------|-------------------|-------------------------------------------|
| FREE (100 req/día) | 10 minutos | ~24 req — solo para desarrollo y pruebas |
| PRO (7,500 req/día) | 60 segundos | ~960 req — producción normal |
| PRO — Mundial/playoffs | 15 segundos | ~3,840 req — máxima fluidez |

**Variable de entorno:** `POLLING_INTERVAL_MS` — cambiar sin tocar código.

**Regla:** El backend usa siempre `/fixtures?live=all` para obtener TODOS los partidos en vivo en **1 sola request** por ciclo. No hacer una request por partido.

---

## 4. DEPORTES SOPORTADOS

### Fase 1 (lanzamiento)
| Deporte | Liga(s) prioritarias | API endpoint base |
|---------|---------------------|-------------------|
| **Fútbol/Soccer** | FIFA World Cup 2026, Liga MX, Liga Bancomer, Copa MX, Champions League, La Liga, Premier League, Libertadores, Sudamericana | `/fixtures` (API-Football) |
| **Béisbol** | MLB (Major League Baseball) | `/games` (API-Baseball) |

### Fase 2 (post-Mundial)
- NFL, NBA, NHL, Fórmula 1

### Selector de deportes en UI
- Mostrar **solo los deportes que tienen partidos ese día** (no mostrar deportes sin eventos)
- Íconos por deporte: ⚽ Fútbol · ⚾ Béisbol · 🏈 NFL · 🏀 NBA · 🏒 NHL · 🏎 F1
- Al entrar a `/ollin-deportes` el sistema detecta automáticamente qué deportes tienen partidos hoy y muestra solo esos

---

## 5. ESTRUCTURA DE PÁGINAS

### 5.1 Página principal — `/ollin-deportes`

**Layout:**
```
[Navbar JeelJel Kaanab — existente]
[Header Ollin Deportes con logo ajolote+balón]
[Selector de deportes horizontal — solo los activos hoy]
[Lista de partidos dividida en 4 columnas: EN VIVO | HOY | PASADOS | PRÓXIMOS]
[Footer JeelJel Kaanab — existente]
```

**Columnas de partidos:**
- **EN VIVO** — partidos actualmente en juego (badge rojo pulsante "● LIVE")
- **HOY** — partidos programados para hoy que aún no empiezan
- **PASADOS** — partidos finalizados hoy con resultado final
- **PRÓXIMOS** — partidos de los próximos 3 días

**Tarjeta de partido (colapsada):**
- Escudo/logo equipo local vs visitante
- Marcador actual (o hora si no ha empezado)
- Estado: LIVE / hora / FT
- Liga y ronda
- Al hacer click → abre página de partido individual

**Estética:** Oscura tipo Bet365/Caliente. Fondo `#0d0d0d` o el fondo existente del sitio. Verde neón o turquesa para elementos activos. Rojo para eventos (goles, tarjetas).

---

### 5.2 Página de partido individual — `/ollin-deportes/partido/:id`

**Layout desktop (3 columnas):**
```
[Header: Equipos + Marcador + Tiempo + Mini-stats]
[Col 1: Campo 2D / Diamond 2D]  [Col 2: Estadísticas]  [Col 3: Chat en vivo]
[Tabs: EN VIVO | ESTADÍSTICAS | JUGADORES | ALINEACIONES | H2H]
```

**Layout móvil:** Una columna, tabs de navegación inferior (igual que las capturas de referencia).

#### Header del partido
- Playera/escudo equipo local — Marcador en vivo — Playera/escudo visitante
- Cronómetro en vivo (minuto actual, tiempo extra, descanso)
- Fila de mini-stats: corners · tarjetas amarillas · tarjetas rojas · goles · tiros

#### Tab: EN VIVO — Campo 2D
**Fútbol:**
- Campo SVG isométrico con gradiente verde
- Zona iluminada indicando posesión de balón (local = izquierda, visitante = derecha)
- Evento flotante cuando ocurre algo: "GOL ⚽", "FALTA", "TIRO LIBRE", "TARJETA", etc.
- Overlay de gol con marcador actualizado (igual que capturas de referencia)
- **SIN** usar imágenes con copyright — todo SVG propio

**Béisbol:**
- Diamante SVG visto desde arriba
- Bases iluminadas según corredores en base (1ra, 2da, 3ra)
- Indicador de inning (top/bottom), outs, bolas, strikes
- Posición del bateador actual
- Evento flotante: "STRIKE", "BOLA", "HIT", "OUT", "CARRERA", "HOME RUN"

#### Tab: ESTADÍSTICAS
**Fútbol:**
- Barras comparativas bidireccionales (verde local / rojo visitante)
- Regular: % posesión, tiros total, disparos a puerta, fuera, bloqueados, al poste, corners, faltas, fueras de juego, tarjetas
- Avanzado: ataques peligrosos, tiros libres, entradas, intercepciones, pases completados

**Béisbol:**
- Carreras, hits, errores por equipo
- Pitcher actual: nombre, innings lanzados, ponches, carreras permitidas, ERA
- Estadísticas de bateo del equipo: promedio colectivo, OBP, SLG

#### Tab: JUGADORES
- Tabla con: # · Nombre · Stats relevantes según deporte
- **Fútbol:** goles, asistencias, tiros, pases, faltas cometidas, minutos
- **Béisbol:** bateadores (AB, H, R, RBI, BB, K, AVG) + pitchers (IP, H, R, ER, BB, K, ERA)
- Tabs: Total · Local · Visitante
- Ordenable por columna

#### Tab: ALINEACIONES
- Formación visual en el campo (fútbol) / lineup de bateo (béisbol)
- Titulares y suplentes

#### Tab: H2H (Head to Head)
- Últimos 5 enfrentamientos entre ambos equipos
- Resultado, fecha, competición

#### Chat en vivo
- Público — cualquier visitante puede escribir sin registrarse
- Nombre de usuario: aleatorio tipo "Aficionado_4821" si no está registrado, o nombre de Ikan Naat si está logueado
- **Censura automática de groserías** en español e inglés (lista negra en backend)
- Mensajes en tiempo real vía Supabase Realtime
- Máximo 200 caracteres por mensaje
- Rate limit: 1 mensaje cada 5 segundos por usuario/IP

---

## 6. VARIABLES DE ENTORNO NECESARIAS (VPS)

```bash
# Ya existe en VPS — misma key que Ikan Naat
API_SPORTS_KEY=<la_que_ya_está_en_el_VPS>

# Supabase — mismas credenciales que Ikan Naat si aplica
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...

# Redis — instalar en VPS si no existe
REDIS_URL=redis://localhost:6379

# Configuración Ollin Deportes
POLLING_INTERVAL_MS=600000    # 10 min en FREE, cambiar a 60000 en PRO, 15000 en Mundial
OLLIN_PORT=10001
```

---

## 7. NGINX — REGLA CRÍTICA

El archivo de Nginx a modificar es **ÚNICAMENTE** `jeeljel-landing`.

Agregar location para el backend de Ollin Deportes:
```nginx
location /api/ollin/ {
    proxy_pass http://localhost:10001/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_cache_bypass $http_upgrade;
}
```

**NUNCA tocar** `/etc/nginx/sites-enabled/ikannaat`.

---

## 8. MONETIZACIÓN (fase posterior)

- **Afiliados casas de apuestas:** banner contextual por deporte. 1xBet Partners (40% rev share), Bet365 Affiliates (30%). Estimado conservador Mundial: $3,000–3,500 USD.
- **AdSense:** integrar una vez que haya tráfico orgánico
- **Acceso premium futuro:** solo suscriptores de alguna app JeelJel Kaanab pueden acceder — decisión CEO pendiente

---

## 9. ORDEN DE CONSTRUCCIÓN (Cursor)

### Día 1 — Hoy (béisbol + fútbol, FREE, polling 10 min)
1. Backend Node.js puerto 10001 con Express + Socket.io + Redis
2. Endpoint `/api/ollin/fixtures/live` — polling a API-Sports, caché Redis
3. Página `/ollin-deportes` con selector de deportes + lista de partidos
4. Página `/ollin-deportes/partido/:id` con header + marcador en vivo
5. Tab Estadísticas con barras comparativas
6. Tab Jugadores con tabla

### Día 2 — Mañana (upgrade a PRO, polling 60 seg)
7. Campo 2D SVG fútbol con eventos animados
8. Diamante 2D SVG béisbol con bases y eventos
9. Chat en vivo con Supabase + censura
10. Tab Alineaciones + H2H
11. Deploy en VPS, configurar Nginx, prueba en producción

### Día 3 en adelante (Mundial activo)
12. Cambiar `POLLING_INTERVAL_MS=15000` para partidos del Mundial
13. Banners de afiliados
14. Optimización móvil

---

## 10. REGLAS DE CONTENIDO Y MARCA

- El nombre visible siempre es **Ollin Deportes** — nunca "Hub Biónico" ni "Hub Deportivo"
- El logo es el ajolote JeelJel con balón (`Logo_JeelJel_Kanaabcon_balon_sin_fondo.png`)
- Fondo y paleta: usar lo que ya existe en jeeljel.com (`#1a0400` + mosaico Macuilxochitl + turquesa `#4ecdc4`)
- **NUNCA mencionar** motores de IA externos ni nombre de la API en el frontend
- En fútbol mostrar **solo ligas principales y latinoamericanas** — no ligas amateur ni de categorías inferiores
- El agente de Apuestas dentro de Ikan Naat (slug `telarana`) es un producto **separado** — Ollin Deportes no lo reemplaza

---

## 11. LIGAS DE FÚTBOL PERMITIDAS

```javascript
const LIGAS_PERMITIDAS = [
  2,    // FIFA World Cup
  3,    // UEFA European Championship
  4,    // Copa América
  9,    // Copa MX
  11,   // CONMEBOL Libertadores
  13,   // CONMEBOL Sudamericana
  140,  // La Liga (España)
  39,   // Premier League (Inglaterra)
  135,  // Serie A (Italia)
  78,   // Bundesliga (Alemania)
  61,   // Ligue 1 (Francia)
  262,  // Liga MX (México)
  // Agregar más ligas LATAM conforme se identifiquen sus IDs
];
```

---

*Documento generado: 09/06/2026 | v1.0 | JeelJel Kaanab*
*Autor: Carlos García Anaya + Claude*
*Siguiente revisión: al completar Día 2 de construcción*
