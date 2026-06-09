/** Ligas de fútbol permitidas — IDs API-Football */
const LIGAS_PERMITIDAS = [
  1, // Torneo internacional de selecciones 2026
  2, // Fútbol internacional — selecciones (API id 2)
  3, // UEFA European Championship
  4, // Copa América
  9, // Copa MX
  11, // CONMEBOL Libertadores
  13, // CONMEBOL Sudamericana
  140, // La Liga
  39, // Premier League
  135, // Serie A
  78, // Bundesliga
  61, // Ligue 1
  262, // Liga MX
]

const LIGAS_PERMITIDAS_SET = new Set(LIGAS_PERMITIDAS)

/** MLB — API-Baseball */
const MLB_LEAGUE_ID = 1

const FOOTBALL_LIVE_STATUSES = new Set(['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE', 'INT'])

module.exports = {
  LIGAS_PERMITIDAS,
  LIGAS_PERMITIDAS_SET,
  MLB_LEAGUE_ID,
  FOOTBALL_LIVE_STATUSES,
}
