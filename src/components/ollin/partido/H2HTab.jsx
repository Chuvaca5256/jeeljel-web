function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function H2HTab({ h2h }) {
  if (!h2h?.length) {
    return <p className="ollin-partido-empty">Sin historial disponible</p>
  }

  return (
    <ul className="ollin-h2h-list">
      {h2h.map((row) => (
        <li key={row.id || `${row.date}-${row.homeTeam}`} className="ollin-h2h-item">
          <span className="ollin-h2h-item__date">{formatDate(row.date)}</span>
          <span className="ollin-h2h-item__match">
            {row.homeTeam} {row.homeScore ?? '-'} – {row.awayScore ?? '-'} {row.awayTeam}
          </span>
          <span className="ollin-h2h-item__league">{row.leagueName}</span>
        </li>
      ))}
    </ul>
  )
}
