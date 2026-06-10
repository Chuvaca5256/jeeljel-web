/** Reglas de cumplimiento legal — Ollin Deportes (backend / respuestas API) */

const BANNED_REPLACEMENTS = [
  [/world\s*cup/gi, 'Torneo de Selecciones'],
  [/copa\s+(del\s+)?mundo/gi, 'Torneo de Selecciones'],
  [/copa\s+mundial/gi, 'Torneo de Selecciones'],
  [/mundial\s*2026/gi, 'torneo de selecciones en vivo'],
  [/mundial/gi, 'torneo de selecciones'],
  [/fifa/gi, ''],
]

const LEAGUE_DISPLAY_NAMES = {
  1: 'Torneo de Selecciones',
  2: 'Champions League',
  3: 'Europa League',
  4: 'Eurocopa',
  9: 'Copa América',
  10: 'Amistosos Internacionales',
  11: 'Copa Libertadores',
  13: 'Copa Sudamericana',
  16: 'Concacaf Champions',
  22: 'Concacaf',
  23: 'Copa Asiática',
  29: 'Copa Africana de Naciones',
  39: 'Premier League',
  45: 'FA Cup',
  61: 'Ligue 1',
  66: 'Copa Francia',
  71: 'Serie A Brasil',
  72: 'Serie B Brasil',
  78: 'Bundesliga',
  81: 'Copa Alemania',
  88: 'Eredivisie',
  90: 'Copa Holanda',
  94: 'Liga Portuguesa',
  96: 'Copa Portugal',
  128: 'Liga Argentina',
  135: 'Serie A',
  137: 'Copa Italia',
  140: 'La Liga',
  143: 'Copa del Rey',
  148: 'Liga Paraguay',
  162: 'Liga Costa Rica',
  234: 'Liga Honduras',
  239: 'Liga Colombia',
  242: 'Liga Ecuador',
  253: 'MLS',
  259: 'Copa MX',
  262: 'Liga MX',
  265: 'Liga Chile',
  281: 'Liga Perú',
  339: 'Liga Guatemala',
  344: 'Liga Bolivia',
  346: 'Liga Venezuela',
  351: 'Liga Uruguay',
  541: 'Mundial de Clubes',
  556: 'Supercopa España',
  667: 'Amistosos Clubes',
  848: 'Leagues Cup',
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
