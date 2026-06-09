/** Reglas de cumplimiento legal — Ollin Deportes (backend / respuestas API) */

const BANNED_REPLACEMENTS = [
  [/world\s*cup/gi, 'Fútbol internacional'],
  [/copa\s+(del\s+)?mundo/gi, 'Fútbol internacional'],
  [/copa\s+mundial/gi, 'Fútbol internacional'],
  [/mundial\s*2026/gi, 'fútbol internacional en vivo'],
  [/mundial/gi, 'fútbol internacional'],
  [/fifa/gi, ''],
]

const LEAGUE_DISPLAY_NAMES = {
  1: 'Fútbol internacional — selecciones',
  2: 'Fútbol internacional — selecciones',
  3: 'Eurocopa',
  4: 'Copa América',
}

const AFFILIATE_COPY = {
  liveOdds: 'Momios en vivo',
  bettorMode: 'Modo Apostador',
}

function sanitizeText(text) {
  if (text == null || typeof text !== 'string') return text
  let out = text
  for (const [pattern, replacement] of BANNED_REPLACEMENTS) {
    out = out.replace(pattern, replacement)
  }
  return out.replace(/\s{2,}/g, ' ').trim()
}

function leagueDisplayName(league) {
  if (!league) return league
  if (LEAGUE_DISPLAY_NAMES[league.id]) {
    return LEAGUE_DISPLAY_NAMES[league.id]
  }
  return sanitizeText(league.name)
}

module.exports = {
  AFFILIATE_COPY,
  LEAGUE_DISPLAY_NAMES,
  sanitizeText,
  leagueDisplayName,
}
