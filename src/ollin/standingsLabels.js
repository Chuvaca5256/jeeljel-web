/** Traduce etiquetas de grupos/standings que vienen en inglés desde API-Sports */

const EXACT_LABELS = {
  'Ranking of third-placed teams': 'Clasificación de terceros',
  'Third-placed teams': 'Clasificación de terceros',
  'Ranking of the best third-placed teams': 'Clasificación de terceros',
  'Best third-placed teams': 'Clasificación de terceros',
  'Knockout stage': 'Fase eliminatoria',
  'Playoffs': 'Playoffs',
  'Relegation': 'Descenso',
  'Promotion': 'Ascenso',
}

export function translateStandingsGroupLabel(label) {
  if (label == null || label === '') return label

  const str = String(label).trim()
  if (EXACT_LABELS[str]) return EXACT_LABELS[str]

  const groupMatch = str.match(/^Group\s+([A-Za-z0-9]+)$/i)
  if (groupMatch) return `Grupo ${groupMatch[1].toUpperCase()}`

  if (/^Grupo\s+[A-Za-z0-9]+$/i.test(str)) {
    const letter = str.replace(/^Grupo\s+/i, '').toUpperCase()
    return `Grupo ${letter}`
  }

  if (/^[A-H]$/i.test(str)) return `Grupo ${str.toUpperCase()}`

  return str
}

export function formatStandingsGroupTitle(groupKey) {
  const translated = translateStandingsGroupLabel(groupKey)
  if (/^Grupo\s+/i.test(translated)) return translated
  return `Grupo ${translated}`
}
