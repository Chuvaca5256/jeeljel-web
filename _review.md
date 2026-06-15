# Review dump — OllinPartido ChatPartido + sendChatMessage body

## 1. OllinPartido.jsx — `<ChatPartido>` y socket

**Render de `ChatPartido`:**

```141:141:src/pages/OllinPartido.jsx
                    <ChatPartido partidoId={id} summary={summary} />
```

Solo se monta cuando `activeTab === 'live'` (sidebar, líneas 139–143).

**Socket en este archivo:** no hay. `OllinPartido.jsx` no importa `socket.io` ni crea conexión.

El socket vive en el hook `usePartido`, que la página sí usa:

```59:59:src/pages/OllinPartido.jsx
  const { loading, error, data } = usePartido(id)
```

Pero `usePartido` **no expone** el socket — solo escucha `ollin:partido:${id}` y `ollin:update` para refrescar datos del partido:

```40:48:src/hooks/usePartido.js
    let socket
    try {
      socket = io(window.location.origin, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: true,
      })
      socket.on(`ollin:partido:${id}`, loadPartido)
      socket.on('ollin:update', loadPartido)
```

`ChatPartido` recibe solo `partidoId` y `summary`; hoy no tiene acceso al socket (habría que pasarlo o conectarlo dentro del componente para `ollin:chat:message`).

---

## 2. sendChatMessage — desestructuración y validación del body

```60:69:ollin-backend/src/services/chatService.js
async function sendChatMessage({ redis, req, body }) {
  const ip = clientIp(req)
  const userId = body.userId || body.user_id || null
  const message = body.message
  const matchId = body.matchId || body.match_id
  const displayName = body.displayName || body.display_name

  if (!matchId) {
    return { ok: false, status: 400, error: 'matchId requerido' }
  }
```

| Campo | Obligatorio | Claves aceptadas |
|--------|-------------|------------------|
| `matchId` | **Sí** | `matchId` / `match_id` |
| `message` | Usado después | `message` |
| `userId` | No | `userId` / `user_id` |
| `displayName` | No | `displayName` / `display_name` |
