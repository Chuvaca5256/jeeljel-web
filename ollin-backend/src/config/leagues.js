/** Ligas de fútbol permitidas — IDs API-Football v3 */
const LIGAS_PERMITIDAS = [
  // Internacional
  1, // Torneo de selecciones
  4, // Eurocopa
  9, // Copa América
  29, // Copa Africana
  23, // Copa Asiática
  16, // Concacaf Champions
  22, // Concacaf Gold Cup / regional
  10, // Amistosos internacionales
  667, // Amistosos clubes
  // Europa clubes
  2, // Champions League
  3, // Europa League
  541, // Mundial de Clubes
  39, // Premier League
  45, // FA Cup
  140, // La Liga
  143, // Copa del Rey
  556, // Supercopa España
  135, // Serie A
  137, // Coppa Italia
  61, // Ligue 1
  66, // Coupe de France
  78, // Bundesliga
  81, // DFB Pokal
  88, // Eredivisie
  90, // KNVB Beker
  94, // Primeira Liga
  96, // Taça de Portugal
  // LATAM
  11, // Libertadores
  13, // Sudamericana
  262, // Liga MX
  259, // Copa MX
  128, // Liga Argentina
  71, // Serie A Brasil
  72, // Serie B Brasil
  239, // Colombia
  265, // Chile
  281, // Perú
  242, // Ecuador
  346, // Venezuela
  351, // Uruguay
  344, // Bolivia
  148, // Paraguay
  234, // Honduras
  339, // Guatemala
  162, // Costa Rica
  253, // MLS
  848, // Leagues Cup
]

const LIGAS_PERMITIDAS_SET = new Set(LIGAS_PERMITIDAS)

/** MLB — API-Baseball */
const MLB_LEAGUE_ID = 1

const BASEBALL_LEAGUES = [1, 2, 5, 12, 17]

const FOOTBALL_LIVE_STATUSES = new Set(['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE', 'INT'])

const STANDINGS_SEASON = 2026

module.exports = {
  LIGAS_PERMITIDAS,
  LIGAS_PERMITIDAS_SET,
  MLB_LEAGUE_ID,
  BASEBALL_LEAGUES,
  FOOTBALL_LIVE_STATUSES,
  STANDINGS_SEASON,
}
