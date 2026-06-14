import { useEffect } from 'react'
import { io } from 'socket.io-client'

export default function useSocketUpdate(onUpdate) {
  useEffect(() => {
    let socket
    try {
      socket = io(window.location.origin, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: true,
      })
      socket.on('ollin:update', onUpdate)
    } catch {}
    return () => socket?.disconnect()
  }, [onUpdate])
}
