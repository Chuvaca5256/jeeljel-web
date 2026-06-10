/** Reglas de cumplimiento legal — Ollin Deportes (UI, metadatos, URLs) */

export const OLLIN_LEGAL_DISCLAIMER =
  'Ollin Deportes es un servicio informativo independiente de estadísticas deportivas. No está afiliado, patrocinado ni respaldado por FIFA, ligas, federaciones, clubes ni organizadores de eventos. Todas las marcas, nombres y logotipos pertenecen a sus respectivos titulares y se mencionan únicamente con fines informativos y de identificación. Ollin Deportes no transmite video ni audio de ningún evento.'

const BANNED_REPLACEMENTS = [
  [/world\s*cup/gi, 'Torneo de Selecciones'],
  [/copa\s+(del\s+)?mundo/gi, 'Torneo de Selecciones'],
  [/copa\s+mundial/gi, 'Torneo de Selecciones'],
  [/mundial\s*2026/gi, 'torneo de selecciones en vivo'],
  [/mundial/gi, 'torneo de selecciones'],
  [/fifa/gi, ''],
]

export const AFFILIATE_COPY = {
  liveOdds: 'Momios en vivo',
  bettorMode: 'Modo Apostador',
}

/** Nombres seguros por ID — fútbol API-Football */
export const FOOTBALL_LEAGUE_DISPLAY_NAMES = {
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

/** Béisbol API-Baseball */
export const BASEBALL_LEAGUE_DISPLAY_NAMES = {
  1: 'MLB',
  2: 'NPB Japón',
  5: 'Liga Mexicana de Béisbol',
  12: 'LVBP Venezuela',
  17: 'Serie Nacional Cuba',
}

export function sanitizeOllinText(text) {
  if (text == null || typeof text !== 'string') return text
  let out = text
  for (const [pattern, replacement] of BANNED_REPLACEMENTS) {
    out = out.replace(pattern, replacement)
  }
  return out.replace(/\s{2,}/g, ' ').trim()
}

export function getLeagueDisplayName(leagueId, fallbackName, sport = 'futbol') {
  const map =
    sport === 'beisbol' ? BASEBALL_LEAGUE_DISPLAY_NAMES : FOOTBALL_LEAGUE_DISPLAY_NAMES
  if (leagueId != null && map[leagueId]) return map[leagueId]
  return sanitizeOllinText(fallbackName || 'Competición')
}

/** @deprecated usar getLeagueDisplayName */
export const LEAGUE_DISPLAY_NAMES = FOOTBALL_LEAGUE_DISPLAY_NAMES
