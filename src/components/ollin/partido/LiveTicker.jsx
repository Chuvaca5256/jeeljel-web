import { useEffect, useState } from 'react'

export default function LiveTicker({ event: ev }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ev) { setVisible(false); return }
    setVisible(true)
  }, [ev])

  if (!ev || !visible) return null

  return (
    <div className="ollin-ticker">
      <span className="ollin-ticker__icon">{ev.icon}</span>
      <span className="ollin-ticker__label">{ev.label}</span>
      <span className="ollin-ticker__team">{ev.team}</span>
      {ev.elapsed !== '—' && (
        <span className="ollin-ticker__min">{ev.elapsed}'</span>
      )}
    </div>
  )
}
