import { getLeagueDisplayName } from './compliance'

/** @typedef {'futbol'|'beisbol'|'nba'|'nfl'} SportId */
/** @typedef {'internacional'|'europa'|'latam'|'beisbol'} LeagueRegion */

/**
 * Catálogo de ligas — IDs API-Sports (football v3 / baseball v1).
 * premiumOnly: estructura futura — no bloquea acceso aún.
 */
export const LEAGUE_CATALOG = [
  // Fútbol internacional
  { id: 1, sport: 'futbol', region: 'internacional', api: 'football', premiumOnly: false },
  { id: 4, sport: 'futbol', region: 'internacional', api: 'football', premiumOnly: false },
  { id: 9, sport: 'futbol', region: 'internacional', api: 'football', premiumOnly: false },
  { id: 29, sport: 'futbol', region: 'internacional', api: 'football', premiumOnly: false },
  { id: 23, sport: 'futbol', region: 'internacional', api: 'football', premiumOnly: false },
  { id: 16, sport: 'futbol', region: 'internacional', api: 'football', premiumOnly: false },
  { id: 22, sport: 'futbol', region: 'internacional', api: 'football', premiumOnly: false },
  { id: 10, sport: 'futbol', region: 'internacional', api: 'football', premiumOnly: false },
  { id: 667, sport: 'futbol', region: 'internacional', api: 'football', premiumOnly: false },
  // Clubes Europa
  { id: 2, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 3, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 541, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 39, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 45, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 140, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 143, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 556, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 135, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 137, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 61, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 66, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 78, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 81, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 88, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 90, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 94, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  { id: 96, sport: 'futbol', region: 'europa', api: 'football', premiumOnly: false },
  // Clubes LATAM
  { id: 11, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 13, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 262, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 259, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 128, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 71, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 72, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 239, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 265, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 281, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 242, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 346, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 351, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 344, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 148, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 234, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 339, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 162, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 253, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  { id: 848, sport: 'futbol', region: 'latam', api: 'football', premiumOnly: false },
  // Béisbol (API-Baseball — ids distintos al fútbol)
  { id: 1, sport: 'beisbol', region: 'beisbol', api: 'baseball', premiumOnly: false },
  { id: 5, sport: 'beisbol', region: 'beisbol', api: 'baseball', premiumOnly: false },
  { id: 2, sport: 'beisbol', region: 'beisbol', api: 'baseball', premiumOnly: false },
  { id: 12, sport: 'beisbol', region: 'beisbol', api: 'baseball', premiumOnly: false },
  { id: 17, sport: 'beisbol', region: 'beisbol', api: 'baseball', premiumOnly: false },
]

export const SPORTS_NAV = [
  { id: 'futbol', label: '⚽ Fútbol', enabled: true },
  { id: 'beisbol', label: '⚾ Béisbol', enabled: true },
  { id: 'nba', label: '🏀 NBA', enabled: false, phase2: true },
  { id: 'nfl', label: '🏈 NFL', enabled: false, phase2: true },
]

export const REGION_LABELS = {
  internacional: 'Fútbol internacional',
  europa: 'Clubes Europa',
  latam: 'Clubes LATAM',
  beisbol: 'Béisbol',
}

export const CENTRAL_TABS = [
  { id: 'live', label: 'EN VIVO' },
  { id: 'hoy', label: 'HOY' },
  { id: 'proximos', label: 'PRÓXIMOS' },
  { id: 'pasados', label: 'PASADOS' },
  { id: 'posiciones', label: 'POSICIONES' },
]

export const PREMIUM_LOCK_MESSAGE =
  'Disponible para suscriptores Pro de JeelJel Kaanab'

export const TORNEO_SELECCIONES_LEAGUE_ID = 1

export function getLeaguesForSport(sport) {
  return LEAGUE_CATALOG.filter((l) => l.sport === sport)
}

export function getLeaguesByRegion(sport) {
  const leagues = getLeaguesForSport(sport)
  const regions = sport === 'beisbol' ? ['beisbol'] : ['internacional', 'europa', 'latam']
  return regions.map((region) => ({
    region,
    label: REGION_LABELS[region],
    leagues: leagues.filter((l) => l.region === region),
  }))
}

export function getLeagueMeta(leagueId, sport) {
  return LEAGUE_CATALOG.find((l) => l.id === leagueId && l.sport === sport)
}

export function getLeagueLabel(leagueId, sport, fallbackName) {
  return getLeagueDisplayName(leagueId, fallbackName, sport)
}
