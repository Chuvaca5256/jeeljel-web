# JEELJEL MASTER — Documento Maestro del Ecosistema
## JeelJel Kaanab | DOC-JEL-2026-MASTER-001 | v1.3 — 25/05/2026

> **Este documento reemplaza y unifica:** `JeelJel_Coins_Ecosistema_Master_v13.md`, `JeelJel_Coins_Ecosistema_Master.md` (alias) y `CURSOR_OllinDeportes_v1.md`. Es la fuente de verdad única sobre economía (JC), identidad unificada (SSO), arquitectura de Ollin Deportes, decisiones permanentes del CEO y pendientes técnicos. Los documentos `SNAPSHOT.md` (estado actual) y `MASTER_BLUEPRINT.md` (hoja de ruta) se mantienen separados.

**Apps del ecosistema:**
- ✅ **Ikan Naat IA** — plataforma de agentes expertos IA (en producción — https://ikannaat.jeeljel.com)
- ✅ **Ollin Deportes** — hub deportivo en tiempo real (en producción — https://jeeljel.com/ollin-deportes)
- 🔲 **Izydra OS** — pendiente
- 🔲 **Virtyou** — pendiente
- 🔲 **Inkógnito** — pendiente

---

# PARTE I — ECONOMÍA JEELJEL COINS (JC) E IDENTIDAD UNIFICADA

## 1. IDENTIDAD UNIFICADA — SSO DEL ECOSISTEMA

### Decisión del CEO — 09/06/2026

**Una sola cuenta JeelJel Kaanab da acceso a todas las apps del ecosistema.**

El hub de identidad es **jeeljel.com** (Opción B). El usuario se registra una sola vez en jeeljel.com y desde ahí puede entrar a cualquier app sin volver a registrarse.

### Principios del SSO

| Principio | Regla |
|-----------|-------|
| Registro único | 1 cuenta en jeeljel.com = acceso a todas las apps |
| Saldo compartido | 1 saldo JC válido en todo el ecosistema |
| Credenciales únicas | Mismo usuario/contraseña en todas las apps |
| Correo y teléfono | Se recopilan al registrarse para comunicaciones autorizadas |

### Flujo de registro unificado

```
1. Usuario entra a jeeljel.com (o a cualquier app del ecosistema)
2. Si no tiene cuenta → se le redirige a jeeljel.com/registro
3. Formulario de registro: nombre, correo, teléfono, contraseña
4. Acepta Términos de Uso + Aviso de Privacidad + consentimiento de comunicaciones
5. Se crea su cuenta en Supabase (tabla jeeljel_users)
6. Se crea su saldo JC inicial en tabla jeeljel_coins (balance: 0)
7. Recibe correo de bienvenida + 20 JC de regalo (CAC)
8. Puede entrar a cualquier app del ecosistema con esas credenciales
```

### Ollin Deportes como puerta de entrada — Estrategia torneo selecciones 2026

**El torneo de selecciones 2026 es el motor de registro más poderoso del ecosistema.**

- Millones de personas buscarán seguir partidos en tiempo real
- Ollin Deportes es gratuito y público durante el torneo — estrategia de adquisición SSO
- Al registrarse en Ollin Deportes durante el torneo → ya tienen cuenta en todo el ecosistema
- Post-torneo: se les presenta Ikan Naat, Izydra OS, Virtyou, Inkógnito

### Modelo de acceso Ollin Deportes — Decisión CEO 09/06/2026

| Fase | Qué ve el usuario | Requisito |
|------|-------------------|-----------|
| **Durante torneo selecciones 2026** | Todo el contenido Ollin Deportes | **Gratis, sin cuenta** (chat requiere registro SSO) |
| **Post-torneo — tier básico** | Marcadores básicos | **Gratis, sin cuenta** |
| **Post-torneo — tier completo** | Estadísticas completas, partidos en vivo detallados, ligas premium | **Suscriptor Pro activo** de cualquier app JeelJel (Ikan Naat, Izydra OS, Virtyou, Inkógnito) |

**Implementación técnica:** flag `PREMIUM_ONLY` por liga ya preparado en arquitectura frontend — activable post-torneo sin rediseño.

**Gatillo de registro en Ollin Deportes:**
- Ver partidos y estadísticas: **libre, sin cuenta**
- Participar en el chat en vivo: **requiere cuenta JeelJel Kaanab**
- Al intentar escribir en el chat → modal de registro rápido (correo + contraseña)

### Comunicaciones autorizadas

Al registrarse el usuario acepta recibir:
- Notificaciones de partidos en vivo (push/email)
- Novedades del ecosistema JeelJel Kaanab
- Ofertas y promociones de las apps
- **NUNCA** vender la base de datos a terceros
- **SIEMPRE** opción de darse de baja en cada comunicación

### Implementación técnica del SSO

```javascript
// Supabase Auth — tabla maestra de usuarios
// jeeljel_users (creada en jeeljel.com)
{
  id: uuid,                    // user_id universal — mismo en todas las apps
  email: string,               // único en el ecosistema
  phone: string,               // opcional pero recomendado
  nombre: string,
  created_at: timestamp,
  origen_registro: string,     // 'ollin_deportes' | 'ikan_naat' | 'jeeljel_com' | etc.
  consentimiento_comunicaciones: boolean,
  pais: string,                // detectado automáticamente por IP
}

// jeeljel_coins — saldo compartido cross-app
{
  user_id: uuid,               // FK a jeeljel_users.id
  balance: integer,            // JC disponibles
  total_recargado: integer,    // histórico
  updated_at: timestamp,
}
```

### Reglas de implementación SSO por app

1. **Nunca crear tabla de usuarios propia** — siempre usar `jeeljel_users` de Supabase
2. **Nunca crear sistema de auth propio** — siempre usar Supabase Auth con JWT compartido
3. **El `user_id` es el mismo** en todas las apps — es el vínculo universal
4. **Al detectar usuario sin cuenta** → redirigir a jeeljel.com/registro, no crear registro local
5. **Ikan Naat ya tiene auth propio** → migrar progresivamente a jeeljel_users en sprint dedicado **post-torneo selecciones 2026**

---

## 2. QUÉ SON LOS JC (JeelJel Coins)

Los JC son la moneda virtual universal del ecosistema JeelJel Kaanab. Funcionan como créditos prepagados que el usuario compra una vez y puede gastar en cualquier app del ecosistema.

**Analogías de referencia:**
- Apple Credits — compras en App Store, música, apps
- Google Play Credits — contenido en todo el ecosistema Google
- Amazon Coins — contenido digital Amazon

**La diferencia con esas plataformas:** Los JC tienen un ancla fija en MXN, lo que da transparencia total al usuario latinoamericano sobre cuánto está gastando en su moneda local.

---

## 3. ANCLA MONETARIA — REGLA INAMOVIBLE

```
1 JC = $1.00 MXN = $0.0578 USD
TC referencia: $17.30 MXN/USD (revisar el 1ro de cada mes)
```

**Esta ancla nunca cambia.** Lo que puede cambiar son los precios en JC de los servicios — no el valor del JC.

---

## 4. CÓMO SE COMPRAN LOS JC — FLUJO TÉCNICO

### El usuario NO paga con Stripe. Usa dLocal Go.

**¿Por qué dLocal Go y no Stripe?**
- Stripe rechaza frecuentemente tarjetas digitales LATAM (BBVA, Mercado Pago, tarjetas prepago)
- dLocal acepta métodos de pago nativos: OXXO (MX), PSE (CO), PagoEfectivo (PE), Pix (BR), Rapipago (AR), SPEI (MX)
- dLocal está diseñado específicamente para mercados emergentes LATAM
- Fee comparable a Stripe pero con tasa de aprobación mucho mayor

### Flujo de compra de JC:

```
1. Usuario elige cuántos JC quiere recargar (mínimo 100 JC)
2. dLocal Go cobra en la moneda local del usuario
3. dLocal convierte a USD y deposita a JeelJel Kaanab (menos su fee)
4. Backend recibe confirmación vía webhook de dLocal
5. Backend acredita N JC al saldo del usuario en Supabase
   (donde N = monto pagado en MXN)
6. Usuario puede gastar sus JC en cualquier app del ecosistema
```

### Reglas críticas del flujo:
- **Fee se cobra SOLO al recargar** — nunca al gastar JC
- **Mínimo de recarga: 100 JC = $100 MXN**
- **Fuente de verdad:** tabla `jeeljel_coins` en Supabase con RLS por `user_id`
- **Argentina:** dLocal gestiona conversión ARS dinámicamente — NO fijar TC de ARS en el sistema

---

## 5. MÍNIMO DE RECARGA Y BLOQUES SUGERIDOS

**Mínimo obligatorio: 100 JC = $100 MXN**

| Bloque | JC | MXN | USD aprox |
|--------|-----|-----|-----------|
| Starter | 100 JC | $100 MXN | $5.78 USD |
| Popular | 250 JC | $250 MXN | $14.45 USD |
| Pro | 500 JC | $500 MXN | $28.90 USD |
| Max | 1,000 JC | $1,000 MXN | $57.80 USD |

---

## 6. ESTRUCTURA DE FEES — dLocal Go por País

| País | Fee fijo | Fee % | Impuesto local | Fee total aprox |
|------|---------|-------|----------------|----------------|
| México | $0.20 USD | 2.49% | 16% IVA sobre comisión | ~$0.40 USD en recarga 100 JC |
| Colombia | $0.20 USD | 1.99% | — | ~$0.32 USD |
| Perú | $0.20 USD | 2.99% | — | ~$0.37 USD |
| Chile | $0.20 USD | 2.99% | — | ~$0.37 USD |
| Argentina | $0.20 USD | 3.49% | — | ~$0.40 USD (dLocal gestiona ARS) |
| Honduras | $0.20 USD | 2.99% | — | ~$0.37 USD |

---

## 7. MARGEN NETO REAL POR PAÍS

Después de descontar: fee dLocal + IVA al SAT + RESICO 2% + ISR 30%.

| País | Neto USD | Neto MXN | Margen neto |
|------|----------|----------|-------------|
| México | $3.13 | $54.11 | **54.1%** |
| Colombia | $3.19 | $55.13 | **55.1%** |
| Perú | $3.15 | $54.43 | **54.4%** |
| Chile | $3.15 | $54.43 | **54.4%** |
| Argentina | $3.13 | $54.08 | **54.1%** |
| Honduras | $3.15 | $54.43 | **54.4%** |

**El margen mejora con recargas mayores:**
- Recarga 100 JC → ~54% neto
- Recarga 250 JC → ~56% neto
- Recarga 500 JC → ~57% neto

---

## 8. TABLA DE PRECIOS BASE — IKAN NAAT IA

Esta tabla es el **piso de precios** para todo el ecosistema. Ninguna app puede cobrar menos por servicios equivalentes.

| Servicio | JC | MXN | USD | Costo API USD | Margen bruto |
|----------|----|-----|-----|---------------|-------------|
| Sesión psicólogo 45 min | 150 JC | $150 | $8.67 | $0.47 | **94.6%** |
| Consulta extra /min (todos N2) | 5 JC | $5 | $0.289 | $0.023 | **92.0%** |
| Chat N1 /consulta | 1 JC | $1 | $0.058 | $0.00024 | **99.6%** |
| Chat N2 /consulta | 4 JC | $4 | $0.231 | $0.0114 | **95.1%** |
| Imagen básica (flux-schnell) | 4 JC | $4 | $0.231 | $0.003 | **98.7%** |
| Imagen Pro (flux-dev) | 15 JC | $15 | $0.867 | $0.025 | **97.1%** |
| Video corto 3-5s | 28 JC | $28 | $1.618 | $0.20 | **87.6%** |
| Video estándar 8-10s | 60 JC | $60 | $3.468 | $0.50 | **85.6%** |
| Ejecución E2B /sesión | 2 JC | $2 | $0.116 | $0.006 | **94.8%** |
| Deep Agent /búsqueda | 15 JC | $15 | $0.867 | $0.04 | **95.4%** |

**Regla para nuevas apps:** Margen bruto mínimo **85%** sobre costo API.

---

## 9. TABLA DE PRECIOS — OLLIN DEPORTES

Ollin Deportes está **completamente funcional en producción** (11/06/2026): https://jeeljel.com/ollin-deportes · backend Node.js `:10001` + Redis + PM2 + Socket.io + **API-Sports PRO** · polling inteligente **15 s live / 3 min idle** · moderación chat activa · cumplimiento legal implementado · **partido individual en producción**.

| Servicio | JC | MXN | Notas |
|----------|----|-----|-------|
| Ver partidos + estadísticas (torneo 2026) | 0 JC | Gratis | ✅ Durante torneo — adquisición SSO |
| Marcadores básicos (post-torneo) | 0 JC | Gratis | ✅ Tier libre permanente |
| Estadísticas completas + live detallado + ligas premium (post-torneo) | 0 JC* | Incluido en Pro | *Requiere suscripción Pro activa en cualquier app JeelJel — no se cobra JC extra |
| Listado fútbol + béisbol MLB | 0 JC | Gratis | ✅ Layout 3 zonas + tabs EN VIVO / HOY / PRÓXIMOS / PASADOS / POSICIONES |
| Chat en vivo | 0 JC | Gratis | Requiere cuenta JeelJel (SSO) — backend moderado activo; UI pendiente |
| Tab POSICIONES (standings + grupos) | 0 JC | Gratis | ✅ Grupos torneo funcionando (PRO) · goleadores/traducciones ES pendiente deploy VPS |
| Vista partido individual | 0 JC | Gratis | ✅ **En producción** — `/ollin-deportes/partido/:id` · SVG + tabs EN VIVO/ESTADÍSTICAS/JUGADORES/ALINEACIONES/H2H |
| Rediseño UI Sofascore/Bet365 | — | — | ✅ En producción (sidebar ligas, tabs, buscador, móvil TABLA) |
| Ollin Deportes Premium (futuro JC) | TBD | TBD | Funciones IA/analista post-torneo |

---

## 10. TABLA DE PRECIOS — IZYDRA OS (pendiente definir)

Izydra OS opera con modelo B2B. Los precios se cobran por empresa/tenant, no por usuario individual.

| Servicio | JC | MXN | Notas |
|----------|----|-----|-------|
| Plan Básico /empresa/mes | TBD | TBD | Asistencias + contratos básicos |
| Plan Pro /empresa/mes | TBD | TBD | Todos los módulos |
| Por módulo adicional | TBD | TBD | À la carte |

**Regla:** Margen mínimo 85% sobre costo de infraestructura. Precios definitivos antes del lanzamiento.

---

## 11. TABLA DE PRECIOS — INKÓGNITO (pendiente definir)

| Servicio | JC | MXN | Notas |
|----------|----|-----|-------|
| Plan Free | 0 JC | Gratis | Acceso básico |
| Plan Pro /mes | TBD | ~$99 MXN | Contenido sin El Velo |
| Plan Creator /mes | TBD | ~$150 MXN | Publicar contenido + revenue share |
| Tokens Inkógnito (interno) | TBD | TBD | Economía interna de la plataforma |

**Nota:** Inkógnito puede tener su propia economía de tokens interna, pero el registro y autenticación son vía SSO JeelJel Kaanab.

---

## 12. TABLA DE PRECIOS — VIRTYOU (pendiente definir)

| Servicio | JC | MXN | Notas |
|----------|----|-----|-------|
| Tarjeta base | TBD | ~$100 MXN | URL única + QR |
| Módulo adicional | TBD | ~$79 MXN | Por módulo (pago único) |
| Todo incluido | TBD | ~$599 MXN | Todos los módulos |

**Nota:** Virtyou usa pago único — no suscripción. Compatible con JC o pago directo vía dLocal.

---

## 13. PUNTO DE EQUILIBRIO DEL ECOSISTEMA

| Métrica | Valor |
|---------|-------|
| Costos fijos mensuales Fase 1 | $253.75 USD |
| Utilidad neta por recarga 100 JC | ~$2.82 USD |
| Recargas mínimas para break-even | **~90 recargas/mes** |
| MAU necesarios (1.5 recargas promedio) | **~60 usuarios activos** |

### Escenarios de rentabilidad mensual:

| Recargas/mes | MAU aprox | Ingreso bruto | Neto retenido | EBITDA |
|-------------|-----------|---------------|---------------|--------|
| 90 | 60 | $518 USD | $280 USD | **$4 USD** ← break-even |
| 150 | 100 | $864 USD | $467 USD | **$176 USD** |
| 300 | 200 | $1,729 USD | $935 USD | **$606 USD** |
| 500 | 333 | $2,882 USD | $1,559 USD | **$1,180 USD** |
| 1,000 | 667 | $5,764 USD | $3,118 USD | **$2,614 USD** |
| 2,000 | 1,333 | $11,528 USD | $6,236 USD | **$5,482 USD** |

---

## 14. CONVERSIÓN LATAM — DISPLAY AL USUARIO

El sistema muestra el precio en la moneda local del usuario — solo informativo. La transacción siempre es en JC.

| País | Moneda | 150 JC en local | Precio mercado | Ventaja |
|------|--------|-----------------|----------------|---------|
| México | MXN | $150 MXN | $150–$300 MXN | 50–66% más barato |
| Perú | PEN (Sol) | S/32.5 | S/40–S/80 | 50–60% más barato |
| Colombia | COP | $35,549 COP | $35K–$85K COP | 50–60% más barato |
| Chile | CLP | $8,237 CLP | $15K–$40K CLP | 50–75% más barato |
| Argentina | ARS | dLocal dinámico | Variable | dLocal gestiona |
| Honduras | HNL | L214 | L200–L500 | 50–70% más barato |

---

## 15. RÉGIMEN FISCAL MÉXICO

| Concepto | Tasa | Base | Nota |
|----------|------|------|------|
| IVA servicios digitales | 16% | Precio bruto al cliente | Se remite íntegro al SAT |
| RESICO | 2% | Ingresos totales | Aplica mientras < ~$14,500 USD/mes |
| ISR Persona Moral (futuro) | 30% | Utilidad neta | Si ingresos > ~$14,500 USD/mes |

---

## 16. MOTORES DE IA — COSTOS DE REFERENCIA

| Motor | Costo/uso USD | Uso recomendado |
|-------|--------------|-----------------|
| Gemini 2.5 Flash ✅ DEFAULT | $0.00024/chat | Chat, fotos, OCR, agentes N1 |
| DeepSeek V3 | $0.0003/chat | Programación, código |
| Groq + Llama 3.3 | $0.00059/chat | Fallback económico |
| Claude Haiku 4.5 | $0.00095/chat | Archivos, documentos |
| Claude Sonnet 4.6 | $0.0114/chat | Agentes expertos N2 — controlar |
| E2B Sandbox | $0.000166/seg | Ejecución código |
| Gemini Live /min | $0.023/min | Videollamada N2 |

---

## 17. CAC — COSTO DE ADQUISICIÓN POR USUARIO NUEVO

| Concepto | Costo USD | Nota |
|----------|-----------|------|
| 20 JC bienvenida | $0.006 | Insignificante |
| 5 imágenes generadas | $0.010 | Bajo |
| 1 video corto 5s (bono WOW) | $0.500 | ⚠️ Principal — escalar con cuidado |
| **TOTAL CAC /usuario** | **$0.516** | Se paga UNA VEZ al registrar |

**Estrategia torneo selecciones 2026:** CAC de Ollin Deportes = $0 durante el torneo — el usuario aporta correo y teléfono como valor al registrarse para chat.

---

## 18. IMPLEMENTACIÓN TÉCNICA SSO + JC

```python
# Verificar autenticación SSO en cualquier app
def verificar_usuario(token_jwt):
    user = supabase.auth.get_user(token_jwt)
    if not user:
        return redirect('https://jeeljel.com/registro')
    return user

# Consultar saldo JC — igual en todas las apps
def consultar_saldo(user_id):
    return supabase.table('jeeljel_coins').select('balance').eq('user_id', user_id).single()

# Descontar JC — igual en todas las apps
def descontar_jc(user_id, costo_jc):
    saldo = consultar_saldo(user_id)
    if saldo['balance'] < costo_jc:
        raise Exception('Saldo insuficiente')
    supabase.table('jeeljel_coins').update({
        'balance': saldo['balance'] - costo_jc
    }).eq('user_id', user_id).execute()
```

### Variables de entorno necesarias (todas las apps):
```
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
DLOCAL_API_KEY=...
DLOCAL_SECRET_KEY=...
DLOCAL_WEBHOOK_SECRET=...
```

---

## 19. REGLAS PARA NUEVAS APPS

1. **SSO obligatorio** — usar jeeljel_users de Supabase, nunca tabla propia
2. **Mismo ancla:** 1 JC = $1 MXN — inamovible
3. **Mismo mínimo:** recarga mínima $100 MXN = 100 JC
4. **Margen mínimo 85%** sobre costo de infraestructura/API
5. **Precio referencia Ikan Naat:** tabla sección 8 como piso
6. **Mismo procesador:** dLocal Go — no Stripe
7. **Transparencia:** mostrar precio en JC + MXN + moneda local
8. **Comunicaciones:** solo a usuarios con consentimiento explícito

---

# PARTE II — ARQUITECTURA OLLIN DEPORTES

## 20. QUÉ ES OLLIN DEPORTES

Ollin Deportes es el hub deportivo en tiempo real de JeelJel Kaanab. Vive en `jeeljel.com/ollin-deportes`. Es un producto **independiente** de Ikan Naat IA — no es un agente dentro de Ikan Naat. El Agente de Apuestas dentro de Ikan Naat (slug `telarana`) es un producto **separado** — Ollin Deportes no lo reemplaza.

**Estado (11/06/2026): EN PRODUCCIÓN** — https://jeeljel.com/ollin-deportes · polling **15 s** con en vivo · plan **API-Sports PRO** ($19 USD/mes) · partido individual `/ollin-deportes/partido/:id` en producción

**Objetivo principal:** Que cualquier persona pueda seguir partidos en vivo con estadísticas granulares, al estilo de casas de apuestas como Bet365 y Caliente, desde la web de JeelJel Kaanab — sin pagar, sin registrarse (durante el torneo selecciones 2026).

**Objetivo secundario:** Funcionar como funnel de adquisición orgánico (SSO) para todo el ecosistema JeelJel Kaanab.

---

## 21. STACK Y FLUJO DE DATOS

### Stack en producción
- **Frontend:** React + Vite + Tailwind (repo `jeeljel-web`)
- **Backend:** Node.js + Express — puerto **10001** (NUNCA el 10000, ese es Ikan Naat)
- **Caché:** Redis — todos los datos de la API se cachean en Redis; los usuarios nunca golpean la API directamente
- **Proceso:** PM2 (`ollin-deportes`) con auto-arranque systemd
- **Tiempo real:** Socket.io — el backend emite evento `ollin:update` a los clientes conectados
- **Chat en vivo:** Supabase (tablas `ollin_chat` y `ollin_chat_moderacion`) — backend moderado activo; UI pendiente
- **API de datos:** API-Football / API-Baseball (API-Sports) — `API_SPORTS_KEY` del VPS

### Flujo de datos
```
API-Sports → Backend Node.js (polling) → Redis (caché) → Socket.io / REST → Frontend React
```

### Reglas de oro de arquitectura
- **NUNCA** hacer polling desde el frontend directamente a API-Sports
- **SIEMPRE** el frontend recibe datos vía Socket.io o endpoints REST del backend
- **NUNCA** exponer la `API_SPORTS_KEY` en el frontend ni en logs
- El backend es el único que habla con API-Sports
- Redis es la fuente de verdad en tiempo real — si Redis tiene el dato, no se consulta la API
- Backend usa `/fixtures?live=all` para obtener TODOS los partidos en vivo en **1 sola request** por ciclo — nunca una request por partido

### Endpoints REST en producción
- `GET /api/ollin/fixtures/live` — partidos en vivo (fútbol + béisbol combinados)
- `GET /api/ollin/fixtures/hoy` — partidos de hoy
- `GET /api/ollin/fixtures/proximos` — próximos 3 días + ligas torneo
- `GET /api/ollin/fixtures/partido/:id` — detalle partido (stats, alineaciones, H2H, eventos)
- `GET /api/ollin/standings/:ligaId` — tabla posiciones por liga (cache 1 h)
- `GET /api/ollin/standings/:ligaId/scorers` — goleadores (cache 1 h; deploy VPS pendiente)
- `GET /api/ollin/health` — status, última actualización, deportes activos, contador de requests
- `POST /chat/messages` y `GET /chat/status` — chat moderado

### Claves Redis
`ollin:futbol:live` · `ollin:futbol:hoy` · `ollin:futbol:proximos` · `ollin:beisbol:hoy` · `ollin:standings:{ligaId}` · `ollin:scorers:{ligaId}` · `ollin:partido:{id}` · `ollin:futbol:events:{fixtureId}` · `ollin:api:requests:YYYY-MM-DD` — TTL = 2× intervalo de polling

---

## 22. INTERVALOS DE POLLING POR PLAN API-SPORTS

| Plan API | Requests/día | Intervalo polling | Cuándo |
|----------|--------------|-------------------|--------|
| ~~FREE~~ | 100 | 10 minutos | ❌ Reemplazado |
| **PRO (activo)** | **7,500** | **15 s live** / **3 min idle** (inteligente) | ✅ **$19 USD/mes** — activo desde 11/06/2026 |
| Ultra | según plan | 15 segundos fijo | Opcional futuro torneo intenso |

**Polling inteligente (`polling.js`):** con ≥1 partido en vivo → ciclo **15 000 ms** (`/fixtures?live=all` + `/fixtures/events` por partido activo); sin en vivo → ciclo **180 000 ms** (próximos + standings). Log: `[ollin][polling] Intervalo: Xms`.

**Variable de entorno:** `POLLING_INTERVAL_MS` — fallback **180000 ms** (3 min idle) si no hay lógica dinámica.
**Protección de límite:** contador diario en Redis; `apiDailyLimit` **7500** · pausa en **`apiDailyPauseAt` 7400** requests — polling se detiene hasta el día siguiente.

---

## 23. DEPORTES Y LIGAS

### En producción hoy
| Deporte | Cobertura actual |
|---------|------------------|
| ⚽ Fútbol | Live ligas permitidas + próximos ligas 1, 2, 3, 4 season 2026 |
| ⚾ Béisbol | MLB en vivo (API-Baseball, liga id 1) |

### Catálogo en producción (rediseño UI v6 — commit `77a556e`)

**Frontend:** `src/ollin/leagueCatalog.js` — ~50 IDs API-Football/Baseball agrupados por región (internacional, europa, latam, béisbol). NBA/NFL deshabilitados (Fase 2).

**Backend:** `ollin-backend/src/config/leagues.js` — IDs ampliados; standings en `standingsService.js` + ruta `/api/ollin/standings/:ligaId`.

### Catálogo adicional futuro

**Fútbol internacional:** Torneo selecciones (ID 1), Eurocopa (3), Copa América (4), Copa Africana, Copa Asiática, Concacaf Centroamericana, amistosos selecciones/clubes.

**Clubes Europa:** Champions League (2), Europa League, Mundial de Clubes, Premier + FA Cup, La Liga + Copa del Rey + Supercopa, Serie A + Copa Italia, Ligue 1 + Copa Francia, Bundesliga + Copa Alemania, Eredivisie + Copa Holanda, Portugal + Copa Portugal, Primeira Liga.

**Clubes LATAM:** Libertadores (11), Sudamericana (13), Liga MX + Copa MX (262, 9), Argentina, Serie A/B Brasil, Colombia, Chile, Perú, Ecuador, Venezuela, Uruguay, Bolivia, Paraguay, Honduras, Guatemala, Costa Rica, MLS + Leagues Cup.

**Béisbol:** MLB (1), Liga Mexicana de Béisbol (LMB), Liga Japonesa NPB, Liga Venezolana LVBP, Serie Nacional Cuba.

**Fase 2 futura:** NBA, NFL, NHL, Fórmula 1.

### Ligas de fútbol permitidas actuales (`LIGAS_PERMITIDAS`)
```javascript
const LIGAS_PERMITIDAS = [
  1,    // Fútbol internacional — torneo selecciones 2026
  2,    // Champions League / selecciones (según temporada API)
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
  // Catálogo completo de la sección 23 se agrega en el rediseño UI
];
```

---

## 24. ESTRUCTURA DE PÁGINAS

### 24.1 Página principal — `/ollin-deportes` (EN PRODUCCIÓN — layout 3 zonas)

**Layout actual (Sofascore/Bet365):**
```
[Navbar JeelJel Kaanab]
[Header Ollin Deportes — logo ajolote+balón + tagline + ☰ móvil]
[Zona izquierda 240px — DEPORTES + panel ligas colapsable ↓/↑ por deporte activo]
[Panel central — buscador global]
[Tabs: EN VIVO · HOY · PRÓXIMOS · PASADOS · POSICIONES (móvil: TABLA)]
[Partidos agrupados por liga — MatchCardCompact]
[Tab POSICIONES — StandingsView cuando tab activo]
[OllinLegalDisclaimer]
[Footer JeelJel Kaanab — hola@ + proyectos@jeeljel.com]
```

- Componentes: `LeagueSidebar`, `MatchGroupList`, `MatchCardCompact`, `StandingsView`, `PremiumLockNotice`
- Hooks: `useOllinData` (REST + Socket.io `ollin:update` + mock) · `useStandings` (tab POSICIONES, fútbol)
- Compliance: `compliance.js`, banderas/iniciales — nunca escudos oficiales
- **Móvil (≤900px):** drawer bajo navbar (top 72px, z-index 110); tab POSICIONES → **TABLA**; scroll en panel de ligas

### 24.2 Mejoras UX sitio jeeljel.com (10/06/2026)

| Página / componente | Cambio |
|---------------------|--------|
| `/apps` | `padding-top` 12px (navbar sticky); sin `min-height: 100vh`; footer sin hueco inferior |
| Home `Stats.jsx` | Botón **Contáctanos** → `mailto:proyectos@jeeljel.com` |
| `Footer.jsx` global | Enlaces `hola@jeeljel.com` + **`proyectos@jeeljel.com`** en todas las rutas |

### 24.3 Página de partido individual — `/ollin-deportes/partido/:id` (EN PRODUCCIÓN)

**Implementado (11/06/2026):**
- Header marcador + estado en vivo
- Campo **SVG isométrico** (fútbol) / **diamante SVG** (béisbol) con eventos en tab EN VIVO
- Tabs: **EN VIVO · ESTADÍSTICAS · JUGADORES · ALINEACIONES · H2H**
- `GET /api/ollin/fixtures/partido/:id` + Socket.io `ollin:partido:{id}` + cache Redis `ollin:partido:{id}` TTL 60 s
- Componentes: `src/pages/OllinPartido.jsx`, `src/hooks/usePartido.js`, `src/components/ollin/partido/*`

**Layout desktop (3 columnas — referencia futura PixiJS):**
```
[Header: Equipos + Marcador + Tiempo + Mini-stats]
[Col 1: Campo 2D / Diamond 2D]  [Col 2: Estadísticas]  [Col 3: Chat en vivo]
[Tabs: EN VIVO | ESTADÍSTICAS | JUGADORES | ALINEACIONES | H2H]
```

- **Campo 2D fútbol:** SVG isométrico propio, zona iluminada de posesión, eventos flotantes (GOL ⚽, FALTA, TARJETA), overlay de gol — SIN imágenes con copyright
- **Diamante 2D béisbol:** SVG visto desde arriba, bases iluminadas, inning (top/bottom), outs, bolas, strikes, eventos (STRIKE, HIT, HOME RUN)
- **Tab Estadísticas:** barras comparativas bidireccionales; fútbol: posesión, tiros, corners, faltas, tarjetas, etc.; béisbol: carreras, hits, errores, pitcher actual, bateo
- **Tab Jugadores:** tabla ordenable; fútbol: goles, asistencias, tiros, pases, minutos; béisbol: AB, H, R, RBI, BB, K, AVG / IP, ER, ERA
- **Tab Alineaciones:** formación visual (fútbol) / lineup de bateo (béisbol)
- **Tab H2H:** últimos 5 enfrentamientos
- **Chat en vivo:** público con cuenta SSO, nombre 'Aficionado_XXXX' o nombre de cuenta, máximo 200 caracteres, rate limit 1 mensaje/5 segundos

---

## 25. MODERACIÓN DE CHAT (ACTIVA EN BACKEND)

- **Categorías bloqueadas:** groserías ES/EN, homofobia (siempre), racismo directo (siempre), racismo contextual ('negro'/'mono'/'chango' solo con insulto o como mensaje solo), URLs/spam, mensaje repetido 3+
- **Normalización anti-evasión:** minúsculas, sin acentos, leet (p0t0, m4ric0n), letras repetidas, puntos/espacios intercalados
- **Contexto:** 'juega de negro' / 'el jersey negro' → pasa; 'pinche negro' → bloquea
- **Acción:** mensaje no se publica + aviso 'Tu mensaje no fue enviado. En Ollin Deportes fomentamos la convivencia sana — sin insultos ni discriminación.' + log en `ollin_chat_moderacion`
- **Reincidencia:** 3 bloqueos en 10 min → mute 15 min; 3 mutes en un día → ban 24 h (Redis)
- **Términos FIFA/Mundial en chat de usuarios: PERMITIDOS** — es expresión de particulares, no uso comercial de JeelJel (decisión legal 09/06/2026)
- Lista de términos editable en `chatFilter.terms.js`; filtro corre SIEMPRE en backend

---

## 26. CUMPLIMIENTO LEGAL (OBLIGATORIO — IMPLEMENTADO)

**Lenguaje neutro — prohibido invocar marcas del torneo:** En UI, textos, metadatos, títulos y URLs de JeelJel **NUNCA** usar: `FIFA`, `World Cup`, `Copa del Mundo`, `Copa Mundial`, `Mundial 2026` ni logo/trofeo/mascotas. Sustituir por: **Fútbol internacional**, **Selecciones nacionales** o nombre sanitizado. Ruta `/mundial-2026` redirige a `/ollin-deportes`.

**Identificadores visuales:**
- Selecciones nacionales → **bandera del país** (flagcdn)
- Clubes → **círculo con iniciales y color propio** — NUNCA escudo oficial
- Backend sanitiza fixtures (`sanitize.js`) antes de Redis; elimina `team.logo` / `league.logo`

**Disclaimer legal** (texto exacto, vía `OllinLayout` + `OllinLegalDisclaimer` en `/ollin-deportes` y cada página de partido):

> "Ollin Deportes es un servicio informativo independiente de estadísticas deportivas. No está afiliado, patrocinado ni respaldado por FIFA, ligas, federaciones, clubes ni organizadores de eventos. Todas las marcas, nombres y logotipos pertenecen a sus respectivos titulares y se mencionan únicamente con fines informativos y de identificación. Ollin Deportes no transmite video ni audio de ningún evento."

**Sin audiovisual:** no incrustar, enlazar ni mostrar video, audio, clips ni highlights. Campo 2D = SVG propio con datos.

**Afiliados apuestas:** solo lenguaje propio — **Momios en vivo**, **Modo Apostador**. Prohibido nombrar el torneo o «Mundial».

**Permitido:** nombres de equipos/selecciones como texto informativo (ej. «México vs Brasil»).

**Módulos:** `src/ollin/compliance.js`, `src/ollin/teamDisplay.js`, `src/components/ollin/*`, `ollin-backend/src/lib/compliance.js`, `ollin-backend/src/lib/sanitize.js`

---

## 27. VARIABLES DE ENTORNO — OLLIN BACKEND (VPS)

Archivo: `/var/www/jeeljel-repo/ollin-backend/.env`

```bash
API_SPORTS_KEY=<en el VPS — misma key que Ikan Naat>
REDIS_URL=redis://localhost:6379
POLLING_INTERVAL_MS=180000    # fallback 3 min idle · polling inteligente 15s live en polling.js
OLLIN_PORT=10001
SUPABASE_URL=<en el VPS>
SUPABASE_SERVICE_KEY=<en el VPS>
```

**Deploy manual backend (VPS):**
```bash
cd /var/www/jeeljel-repo && git pull && pm2 restart ollin-deportes
```
- Ruta código: `/var/www/jeeljel-repo/ollin-backend` — **NO** `/var/www/ollin-backend` (obsoleta)
- PM2 process name: **`ollin-deportes`**

---

## 28. NGINX — REGLA CRÍTICA

El archivo de Nginx a modificar es **ÚNICAMENTE** `/etc/nginx/sites-enabled/jeeljel-landing`.

Location ya configurado en producción:
```nginx
location /api/ollin/ {
    proxy_pass http://localhost:10001/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_cache_bypass $http_upgrade;
}
```

**NUNCA tocar** `/etc/nginx/sites-enabled/ikannaat`. **NUNCA** hacer `proxy_pass` a `localhost:10000` en `jeeljel-landing`.

---

## 29. MONETIZACIÓN OLLIN DEPORTES

- **Afiliados casas de apuestas:** banner contextual por deporte. 1xBet Partners (40% rev share), Bet365 Affiliates (30%). Estimado conservador torneo: $3,000–3,500 USD.
- **AdSense:** integrar una vez que haya tráfico orgánico
- **Acceso premium post-torneo:** estadísticas completas, live detallado y ligas premium = exclusivo suscriptores Pro de cualquier app JeelJel (ver Parte I, sección 1)

---

## 30. REGLAS DE CONTENIDO Y MARCA — OLLIN

- El nombre visible siempre es **Ollin Deportes** — nunca "Hub Biónico" ni "Hub Deportivo"
- Logo: ajolote JeelJel con balón (`Logo_JeelJel_Kanaabcon_balon_sin_fondo.png`)
- Paleta: fondo `#1a0400` + mosaico Macuilxochitl + turquesa `#4ecdc4` + amarillo activo `#f0c030`
- **NUNCA mencionar** motores de IA externos ni el nombre de la API en el frontend
- En fútbol mostrar solo ligas principales e internacionales del catálogo — no ligas amateur

---

# PARTE III — DECISIONES PERMANENTES DEL CEO

Estas decisiones no se revisan — son arquitectura de negocio:

| # | Decisión | Valor |
|---|----------|-------|
| 1 | Ancla JC | 1 JC = $1 MXN — inamovible |
| 2 | Procesador LATAM | dLocal Go — no Stripe |
| 3 | Mínimo recarga | $100 MXN = 100 JC |
| 4 | Psicólogo | SIEMPRE IA — nunca humano |
| 5 | Taxímetro N2 | 5 JC/min universal — sin excepciones |
| 6 | Sesión psicólogo | 150 JC / 45 min — prepago al iniciar |
| 7 | JC cross-app | Válidos en todas las apps JeelJel |
| 8 | TC revisión | 1ro de cada mes — no afecta ancla |
| 9 | Argentina ARS | dLocal gestiona — no fijar TC |
| 10 | SSO hub | jeeljel.com — Opción B — inamovible |
| 11 | Registro en Ollin | Chat requiere cuenta JeelJel — ver gratis sin cuenta durante torneo |
| 12 | Ollin acceso torneo 2026 | Público gratuito — adquisición SSO |
| 13 | Ollin acceso post-torneo | Marcadores básicos libres; premium = suscriptor Pro cualquier app JeelJel |
| 14 | Ollin flag PREMIUM_ONLY | Por liga — frontend preparado, activar post-torneo |
| 15 | API-Sports upgrade | ✅ **PRO activo** — $19 USD/mes · polling inteligente 15 s / 3 min |
| 16 | Comunicaciones | Solo con consentimiento explícito al registrarse |
| 17 | Ollin puerto backend | 10001 — nunca 10000 (Ikan Naat) |
| 18 | Ollin independiente | Producto separado de Ikan Naat; Agente Apuestas (`telarana`) sigue en Ikan Naat |
| 19 | Chat usuarios y marcas | Términos FIFA/Mundial permitidos en chat de usuarios (UGC); prohibidos en copy propio de JeelJel |
| 20 | Lista negra chat | Groserías + homofobia + racismo + spam — moderación backend siempre activa |

---

# PARTE IV — PENDIENTES TÉCNICOS ACTIVOS

| ID | Prioridad | Descripción | App | Estado |
|----|-----------|-------------|-----|--------|
| **SSO-1** | 🔴 URGENTE | Crear página jeeljel.com/registro con SSO Supabase | jeeljel.com | ⏳ Pendiente |
| **SSO-2** | 🔴 URGENTE | Modal de registro en Ollin Deportes al intentar chatear | Ollin Deportes | ⏳ Pendiente |
| **SSO-3** | 🟡 | Migrar auth Ikan Naat a jeeljel_users (post-torneo) | Ikan Naat | ⏳ Pendiente |
| **SSO-4** | 🟡 | Tabla jeeljel_users en Supabase con origen_registro y consentimiento | jeeljel.com | ⏳ Pendiente |
| **FIN-4** | 🔴 | Display moneda local automático por país | Todas | ⏳ Pendiente |
| **FIN-5** | 🟡 | Argentina ARS dinámico vía dLocal | Todas | ⏳ Pendiente |
| **FIN-6** | 🟡 | Verificar cross-app jeeljel_coins entre apps | Todas | ⏳ Pendiente |
| **OLLIN-1** | — | Backend Node.js puerto 10001 + Redis + PM2 + Socket.io | Ollin Deportes | ✅ Completado |
| **OLLIN-2** | — | Frontend layout 3 zonas + catálogo ligas + POSICIONES UI | Ollin Deportes | ✅ Completado |
| **OLLIN-3** | — | Página `/ollin-deportes/partido/:id` completa | Ollin Deportes | ✅ Completado |
| **OLLIN-4** | — | Tab POSICIONES — grupos torneo funcionando (PRO) | Ollin Deportes | ✅ Completado |
| **OLLIN-4b** | 🟡 | Goleadores + traducciones ES standings — deploy VPS | Ollin Deportes | ⏳ Código en repo |
| **OLLIN-5** | 🟡 | UI chat en vivo (backend + moderación ya activos) | Ollin Deportes | ⏳ Pendiente |
| **OLLIN-6** | — | Cumplimiento legal (compliance + sanitize + disclaimer) | Ollin Deportes | ✅ Completado |
| **OLLIN-7** | — | Polling próximos ligas 1/2/3/4 season 2026 | Ollin Deportes | ✅ Completado |
| **OLLIN-8** | — | Rediseño UI 3 zonas (Sofascore/Bet365) + sidebar ligas | Ollin Deportes | ✅ Completado |
| **OLLIN-9** | — | Catálogo ligas/deportes (sección 23) | Ollin Deportes | ✅ Completado |
| **OLLIN-10** | — | Upgrade API-Sports PRO + polling inteligente | Ollin Deportes | ✅ Completado |
| **OLLIN-11** | 🟡 | Activar modelo premium post-torneo (`PREMIUM_ONLY`) | Ollin Deportes | ⏳ Post-torneo |
| **OLLIN-12** | — | Deploy manual VPS backend + PM2 (`/var/www/jeeljel-repo`, `ollin-deportes`) | Ollin Deportes | ✅ Completado |
| **OLLIN-13** | 🟡 | Campo 2D PixiJS + modo apostador (SVG básico en partido ✅) | Ollin Deportes | ⏳ Fase Día 2+ |
| **OLLIN-14** | 🟡 | Afiliados: registro 1xBet Partners + Bet365 Affiliates | Ollin Deportes | ⏳ Pendiente |
| **OLLIN-15** | 🟡 | Workflow GitHub Actions auto-deploy backend | Ollin Deportes | ⏳ Pendiente |
| **WEB-1** | — | Espaciado `/apps` (navbar sticky + footer) | jeeljel.com | ✅ Completado |
| **WEB-2** | — | Contacto `proyectos@jeeljel.com` — footer + botón Home | jeeljel.com | ✅ Completado |
| **WEB-3** | — | Ajustes móvil Ollin (TABLA + menú Fútbol) | Ollin Deportes | ✅ Completado |
| **WEB-4** | 🟡 | CTA tarjeta Ollin en `/apps` — «¡Ingresa aquí!» | jeeljel.com | ⏳ Pendiente |

---

*Documento generado: 10/06/2026 | Versión: **v1.3** (25/05/2026 — backend VPS git + límites PRO) | Autor: JeelJel Kaanab — Carlos García Anaya + Claude*
*Unifica: JeelJel_Coins_Ecosistema_Master_v13.md + CURSOR_OllinDeportes_v1.md + alias Coins Master*

*Documentos hermanos: SNAPSHOT.md (estado actual — v6) · MASTER_BLUEPRINT.md (hoja de ruta)*
*Próxima revisión: 01/07/2026 (TC mensual + post-torneo)*
