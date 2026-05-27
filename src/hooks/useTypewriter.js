import { useEffect, useRef } from 'react'

export function useTypewriter(text, speed = 41) {
  const ref = useRef(null)
  const played = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !played.current) {
          played.current = true
          el.textContent = ''
          let i = 0
          const interval = setInterval(() => {
            el.textContent = text.slice(0, i) + '|'
            i++
            if (i > text.length) {
              el.textContent = text
              clearInterval(interval)
            }
          }, speed)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [text, speed])

  return ref
}
