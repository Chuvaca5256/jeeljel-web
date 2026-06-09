const { leagueDisplayName, sanitizeText } = require('./compliance')

const FLAG_CDN = 'https://flagcdn.com'

function isNationalTeam(team) {
  return Boolean(team?.national)
}

function countryFlagUrl(countryCode, size = '48x36') {
  const code = String(countryCode || '').trim().toLowerCase()
  if (!code || code.length !== 2) return null
  return `${FLAG_CDN}/${size}/${code}.png`
}

function teamInitials(name) {
  if (!name) return '?'
  const words = String(name).trim().split(/\s+/).filter(Boolean)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

function teamAccentColor(team) {
  const fromApi = team?.colors?.primary || team?.colors?.player?.primary
  if (fromApi && typeof fromApi === 'string' && fromApi.startsWith('#')) {
    return fromApi
  }
  let hash = 0
  const str = team?.name || 'team'
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return `hsl(${Math.abs(hash) % 360}, 55%, 42%)`
}

function buildTeamDisplay(team) {
  if (!team) {
    return { type: 'initials', initials: '?', color: '#4ecdc4', flagUrl: null, name: null }
  }

  const safeName = sanitizeText(team.name)

  if (isNationalTeam(team)) {
    return {
      type: 'flag',
      name: safeName,
      flagUrl: countryFlagUrl(team.country || team.code),
      initials: teamInitials(safeName),
      color: teamAccentColor(team),
    }
  }

  return {
    type: 'initials',
    name: safeName,
    initials: teamInitials(safeName),
    color: teamAccentColor(team),
    flagUrl: null,
  }
}

function sanitizeTeam(team) {
  if (!team) return team
  const { logo, ...rest } = team
  return {
    ...rest,
    name: sanitizeText(team.name),
    display: buildTeamDisplay(team),
  }
}

function sanitizeLeague(league) {
  if (!league) return league
  const { logo, ...rest } = league
  return {
    ...rest,
    name: leagueDisplayName(league),
    round: sanitizeText(league.round),
  }
}

/** Elimina logos oficiales y añade display propio antes de guardar en Redis */
function sanitizeFootballFixture(fixture) {
  if (!fixture) return fixture
  return {
    ...fixture,
    league: sanitizeLeague(fixture.league),
    teams: {
      home: sanitizeTeam(fixture.teams?.home),
      away: sanitizeTeam(fixture.teams?.away),
    },
    fixture: fixture.fixture
      ? {
          ...fixture.fixture,
          venue: fixture.fixture.venue
            ? { ...fixture.fixture.venue, name: sanitizeText(fixture.fixture.venue.name) }
            : fixture.fixture.venue,
        }
      : fixture.fixture,
  }
}

function sanitizeFootballFixtures(fixtures) {
  if (!Array.isArray(fixtures)) return fixtures
  return fixtures.map(sanitizeFootballFixture)
}

function sanitizeBaseballGame(game) {
  if (!game) return game
  const teams = game.teams || {}
  return {
    ...game,
    league: game.league
      ? { ...game.league, name: sanitizeText(game.league.name), logo: undefined }
      : game.league,
    teams: {
      home: teams.home
        ? { ...teams.home, name: sanitizeText(teams.home.name), logo: undefined, display: buildTeamDisplay({ ...teams.home, national: false, name: teams.home.name }) }
        : teams.home,
      away: teams.away
        ? { ...teams.away, name: sanitizeText(teams.away.name), logo: undefined, display: buildTeamDisplay({ ...teams.away, national: false, name: teams.away.name }) }
        : teams.away,
    },
  }
}

function sanitizeBaseballGames(games) {
  if (!Array.isArray(games)) return games
  return games.map(sanitizeBaseballGame)
}

module.exports = {
  buildTeamDisplay,
  sanitizeFootballFixtures,
  sanitizeBaseballGames,
  sanitizeText,
}
