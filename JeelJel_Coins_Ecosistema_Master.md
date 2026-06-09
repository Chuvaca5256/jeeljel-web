# JeelJel Coins (JC) — Economía Universal del Ecosistema
## JeelJel Kaanab | Documento Maestro | v13 — 09/06/2026

---

## ¿QUÉ ES ESTE DOCUMENTO?

Este documento es la fuente de verdad única sobre cómo funciona la economía de tokens (JC) y la identidad unificada de usuarios en todo el ecosistema JeelJel Kaanab. Aplica a **todas las apps** — actuales y futuras. Cualquier equipo que construya una nueva app bajo JeelJel Kaanab debe leer este documento antes de definir precios, cobros, autenticación o integraciones de pago.

**Apps del ecosistema:**
- ✅ **Ikan Naat IA** — plataforma de agentes expertos IA (en producción)
- 🔲 **Izydra OS** — pendiente
- 🔲 **Virtyou** — pendiente
- 🔲 **Inkógnito** — pendiente
- 🟡 **Ollin Deportes** — en construcción (funnel de registro del ecosistema)

---

## 0. IDENTIDAD UNIFICADA — SSO DEL ECOSISTEMA (NUEVO v13)

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

### Ollin Deportes como puerta de entrada — Estrategia Mundial 2026

**El Mundial 2026 es el motor de registro más poderoso del ecosistema.**

- Millones de personas buscarán seguir partidos en tiempo real
- Ollin Deportes es gratuito y público — pero para el chat en vivo se requiere cuenta JeelJel
- Al registrarse en Ollin Deportes durante el Mundial → ya tienen cuenta en todo el ecosistema
- Post-Mundial: se les presenta Ikan Naat, Izydra OS, Virtyou, Inkógnito

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

### Reglas de implementación por app

1. **Nunca crear tabla de usuarios propia** — siempre usar `jeeljel_users` de Supabase
2. **Nunca crear sistema de auth propio** — siempre usar Supabase Auth con JWT compartido
3. **El `user_id` es el mismo** en todas las apps — es el vínculo universal
4. **Al detectar usuario sin cuenta** → redirigir a jeeljel.com/registro, no crear registro local
5. **Ikan Naat ya tiene auth propio** → migrar progresivamente a jeeljel_users en sprint dedicado post-Mundial

---

## 1. QUÉ SON LOS JC (JeelJel Coins)

Los JC son la moneda virtual universal del ecosistema JeelJel Kaanab. Funcionan como créditos prepagados que el usuario compra una vez y puede gastar en cualquier app del ecosistema.

**Analogías de referencia:**
- Apple Credits — compras en App Store, música, apps
- Google Play Credits — contenido en todo el ecosistema Google
- Amazon Coins — contenido digital Amazon

**La diferencia con esas plataformas:** Los JC tienen un ancla fija en MXN, lo que da transparencia total al usuario latinoamericano sobre cuánto está gastando en su moneda local.

---

## 2. ANCLA MONETARIA — REGLA INAMOVIBLE

```
1 JC = $1.00 MXN = $0.0578 USD
TC referencia: $17.30 MXN/USD (revisar el 1ro de cada mes)
```

**Esta ancla nunca cambia.** Lo que puede cambiar son los precios en JC de los servicios — no el valor del JC.

---

## 3. CÓMO SE COMPRAN LOS JC — FLUJO TÉCNICO

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

## 4. MÍNIMO DE RECARGA Y BLOQUES SUGERIDOS

**Mínimo obligatorio: 100 JC = $100 MXN**

| Bloque | JC | MXN | USD aprox |
|--------|-----|-----|-----------|
| Starter | 100 JC | $100 MXN | $5.78 USD |
| Popular | 250 JC | $250 MXN | $14.45 USD |
| Pro | 500 JC | $500 MXN | $28.90 USD |
| Max | 1,000 JC | $1,000 MXN | $57.80 USD |

---

## 5. ESTRUCTURA DE FEES — dLocal Go por País

| País | Fee fijo | Fee % | Impuesto local | Fee total aprox |
|------|---------|-------|----------------|----------------|
| México | $0.20 USD | 2.49% | 16% IVA sobre comisión | ~$0.40 USD en recarga 100 JC |
| Colombia | $0.20 USD | 1.99% | — | ~$0.32 USD |
| Perú | $0.20 USD | 2.99% | — | ~$0.37 USD |
| Chile | $0.20 USD | 2.99% | — | ~$0.37 USD |
| Argentina | $0.20 USD | 3.49% | — | ~$0.40 USD (dLocal gestiona ARS) |
| Honduras | $0.20 USD | 2.99% | — | ~$0.37 USD |

---

## 6. MARGEN NETO REAL POR PAÍS

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

## 7. TABLA DE PRECIOS BASE — IKAN NAAT IA

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

## 8. TABLA DE PRECIOS — OLLIN DEPORTES (NUEVO v13)

Ollin Deportes es **gratuito** en su versión base. Los JC aplican solo para funciones premium futuras.

| Servicio | JC | MXN | Notas |
|----------|----|-----|-------|
| Ver partidos + estadísticas | 0 JC | Gratis | Siempre gratuito — funnel de adquisición |
| Chat en vivo | 0 JC | Gratis | Requiere cuenta JeelJel (SSO) |
| Ollin Deportes Premium (futuro) | TBD | TBD | Decisión CEO pendiente post-Mundial |

---

## 9. TABLA DE PRECIOS — IZYDRA OS (pendiente definir)

Izydra OS opera con modelo B2B. Los precios se cobran por empresa/tenant, no por usuario individual.

| Servicio | JC | MXN | Notas |
|----------|----|-----|-------|
| Plan Básico /empresa/mes | TBD | TBD | Asistencias + contratos básicos |
| Plan Pro /empresa/mes | TBD | TBD | Todos los módulos |
| Por módulo adicional | TBD | TBD | À la carte |

**Regla:** Margen mínimo 85% sobre costo de infraestructura. Precios definitivos antes del lanzamiento.

---

## 10. TABLA DE PRECIOS — INKÓGNITO (pendiente definir)

| Servicio | JC | MXN | Notas |
|----------|----|-----|-------|
| Plan Free | 0 JC | Gratis | Acceso básico |
| Plan Pro /mes | TBD | ~$99 MXN | Contenido sin El Velo |
| Plan Creator /mes | TBD | ~$150 MXN | Publicar contenido + revenue share |
| Tokens Inkógnito (interno) | TBD | TBD | Economía interna de la plataforma |

**Nota:** Inkógnito puede tener su propia economía de tokens interna, pero el registro y autenticación son vía SSO JeelJel Kaanab.

---

## 11. TABLA DE PRECIOS — VIRTYOU (pendiente definir)

| Servicio | JC | MXN | Notas |
|----------|----|-----|-------|
| Tarjeta base | TBD | ~$100 MXN | URL única + QR |
| Módulo adicional | TBD | ~$79 MXN | Por módulo (pago único) |
| Todo incluido | TBD | ~$599 MXN | Todos los módulos |

**Nota:** Virtyou usa pago único — no suscripción. Compatible con JC o pago directo vía dLocal.

---

## 12. PUNTO DE EQUILIBRIO DEL ECOSISTEMA

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

## 13. CONVERSIÓN LATAM — DISPLAY AL USUARIO

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

## 14. RÉGIMEN FISCAL MÉXICO

| Concepto | Tasa | Base | Nota |
|----------|------|------|------|
| IVA servicios digitales | 16% | Precio bruto al cliente | Se remite íntegro al SAT |
| RESICO | 2% | Ingresos totales | Aplica mientras < ~$14,500 USD/mes |
| ISR Persona Moral (futuro) | 30% | Utilidad neta | Si ingresos > ~$14,500 USD/mes |

---

## 15. MOTORES DE IA — COSTOS DE REFERENCIA

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

## 16. CAC — COSTO DE ADQUISICIÓN POR USUARIO NUEVO

| Concepto | Costo USD | Nota |
|----------|-----------|------|
| 20 JC bienvenida | $0.006 | Insignificante |
| 5 imágenes generadas | $0.010 | Bajo |
| 1 video corto 5s (bono WOW) | $0.500 | ⚠️ Principal — escalar con cuidado |
| **TOTAL CAC /usuario** | **$0.516** | Se paga UNA VEZ al registrar |

**Estrategia Mundial 2026:** CAC de Ollin Deportes = $0 (no hay bono de bienvenida para registro vía chat) — el usuario ya aportó su correo y teléfono como valor.

---

## 17. IMPLEMENTACIÓN TÉCNICA SSO + JC

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

## 18. REGLAS PARA NUEVAS APPS

1. **SSO obligatorio** — usar jeeljel_users de Supabase, nunca tabla propia
2. **Mismo ancla:** 1 JC = $1 MXN — inamovible
3. **Mismo mínimo:** recarga mínima $100 MXN = 100 JC
4. **Margen mínimo 85%** sobre costo de infraestructura/API
5. **Precio referencia Ikan Naat:** tabla sección 7 como piso
6. **Mismo procesador:** dLocal Go — no Stripe
7. **Transparencia:** mostrar precio en JC + MXN + moneda local
8. **Comunicaciones:** solo a usuarios con consentimiento explícito

---

## 19. DECISIONES PERMANENTES DEL CEO

| Decisión | Valor |
|----------|-------|
| Ancla JC | 1 JC = $1 MXN — inamovible |
| Procesador LATAM | dLocal Go — no Stripe |
| Mínimo recarga | $100 MXN = 100 JC |
| Psicólogo | SIEMPRE IA — nunca humano |
| Taxímetro N2 | 5 JC/min universal — sin excepciones |
| Sesión psicólogo | 150 JC / 45 min — prepago al iniciar |
| JC cross-app | Válidos en todas las apps JeelJel |
| TC revisión | 1ro de cada mes — no afecta ancla |
| Argentina ARS | dLocal gestiona — no fijar TC |
| **SSO hub** | **jeeljel.com — Opción B — inamovible** |
| **Registro en Ollin** | **Chat requiere cuenta JeelJel — ver gratis sin cuenta** |
| **Comunicaciones** | **Solo con consentimiento explícito al registrarse** |

---

## 20. PENDIENTES DE IMPLEMENTACIÓN

| ID | Prioridad | Descripción | App |
|----|-----------|-------------|-----|
| **SSO-1** | 🔴 URGENTE | Crear página jeeljel.com/registro con SSO Supabase | jeeljel.com |
| **SSO-2** | 🔴 URGENTE | Modal de registro en Ollin Deportes al intentar chatear | Ollin Deportes |
| **SSO-3** | 🟡 | Migrar auth Ikan Naat a jeeljel_users (post-Mundial) | Ikan Naat |
| **SSO-4** | 🟡 | Tabla jeeljel_users en Supabase con campos origen_registro y consentimiento | jeeljel.com |
| **FIN-4** | 🔴 | Display moneda local automático por país | Todas |
| **FIN-5** | 🟡 | Argentina ARS dinámico vía dLocal | Todas |
| **FIN-6** | 🟡 | Verificar cross-app jeeljel_coins entre apps | Todas |
| **OLLIN-1** | 🔴 URGENTE | Backend Node.js puerto 10001 + Redis + Socket.io | Ollin Deportes |
| **OLLIN-2** | 🔴 URGENTE | Frontend béisbol + fútbol operativo antes del 11/06 | Ollin Deportes |

---

*Documento generado: 09/06/2026 | Versión: v13 | Autor: JeelJel Kaanab*
*Cambios v13: SSO unificado (Sección 0), tablas de precios por app (Secciones 8-11), estrategia Mundial como funnel de registro*
*Próxima revisión: 01/07/2026 (TC mensual + post-Mundial)*
