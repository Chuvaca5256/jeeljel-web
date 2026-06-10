export default function FootballFieldLive({ summary, events = [] }) {
  const possessionSide = summary?.possessionSide || 'home'

  return (
    <div className="ollin-field-wrap">
      <svg viewBox="0 0 400 260" className="ollin-field-svg" role="img" aria-label="Campo de fútbol">
        <defs>
          <linearGradient id="ollinPitch" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a5c42" />
            <stop offset="100%" stopColor="#134832" />
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="384" height="244" rx="6" fill="url(#ollinPitch)" stroke="#4ecdc4" strokeWidth="1.5" />
        <line x1="200" y1="8" x2="200" y2="252" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <circle cx="200" cy="130" r="36" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <rect x="8" y="78" width="52" height="104" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <rect x="340" y="78" width="52" height="104" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />

        <ellipse
          cx={possessionSide === 'home' ? 120 : 280}
          cy="130"
          rx="70"
          ry="55"
          fill="rgba(240, 192, 48, 0.12)"
          stroke="rgba(240, 192, 48, 0.45)"
          strokeWidth="1"
        />
      </svg>

      <ul className="ollin-field-events">
        {events.length === 0 ? (
          <li className="ollin-field-events__empty">Sin eventos en vivo registrados</li>
        ) : (
          events.slice(-8).map((ev, i) => (
            <li key={`${ev.minute}-${i}`} className="ollin-field-events__item">
              <span className="ollin-field-events__min">{ev.minute != null ? `${ev.minute}'` : '—'}</span>
              <span className="ollin-field-events__label">{ev.label}</span>
              {ev.player && <span className="ollin-field-events__player">{ev.player}</span>}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
