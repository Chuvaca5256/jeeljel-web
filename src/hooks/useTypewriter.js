import { useEffect, useRef } from 'react'

export function useTypewriter(text, delay = 0) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.textContent = ''
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        el.textContent = text.slice(0, i) + '|'
        i++
        if (i > text.length) {
          el.textContent = text
          clearInterval(interval)
        }
      }, 55)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay])

  return ref
}
