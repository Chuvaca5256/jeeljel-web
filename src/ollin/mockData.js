/** Datos demo cuando el backend no está disponible */

function fb(id, home, away, leagueId, league, status, homeScore, awayScore, minute, hour) {
  return {
    id: `fb-${id}`,
    sport: 'futbol',
    leagueId,
    homeTeam: { name: home, national: true, country: home === 'México' ? 'MX' : 'AR' },
    awayTeam: { name: away, national: true, country: away === 'Brasil' ? 'BR' : 'CO' },
    homeScore,
    awayScore,
    status,
    statusLabel: status === 'live' ? `${minute}'` : status === 'finished' ? 'FT' : hour,
    leagueName: league,
    date: new Date().toISOString(),
  }
}

function bb(id, home, away, status, homeScore, awayScore, inning, hour) {
  return {
    id: `bb-${id}`,
    sport: 'beisbol',
    leagueId: 1,
    homeTeam: { name: home, national: false },
    awayTeam: { name: away, national: false },
    homeScore,
    awayScore,
    status,
    statusLabel: status === 'live' ? inning : status === 'finished' ? 'FT' : hour,
    leagueName: 'MLB',
    date: new Date().toISOString(),
  }
}

export const MOCK_MATCHES = {
  live: [
    fb(1, 'México', 'Brasil', 262, 'Liga MX', 'live', 1, 1, 67, null),
    fb(2, 'Argentina', 'Colombia', 11, 'Copa Libertadores', 'live', 2, 0, 34, null),
    fb(3, 'Alemania', 'Francia', 1, 'Torneo de Selecciones', 'live', 0, 1, 52, null),
    bb(1, 'Yankees', 'Red Sox', 'live', 4, 3, '7° inning', null),
    bb(2, 'Dodgers', 'Giants', 'live', 2, 2, '5° inning', null),
  ],
  hoyScheduled: [
    fb(4, 'Chile', 'Perú', 239, 'Liga Colombia', 'scheduled', null, null, null, '20:00'),
    fb(5, 'España', 'Italia', 140, 'La Liga', 'scheduled', null, null, null, '21:45'),
    bb(3, 'Cubs', 'Cardinals', 'scheduled', null, null, null, '19:10'),
    bb(4, 'Astros', 'Rangers', 'scheduled', null, null, null, '20:05'),
  ],
  hoyFinished: [
    fb(6, 'Uruguay', 'Ecuador', 11, 'Copa Libertadores', 'finished', 3, 1, null, 'FT'),
    fb(7, 'Portugal', 'Inglaterra', 39, 'Premier League', 'finished', 0, 0, null, 'FT'),
    bb(5, 'Mets', 'Phillies', 'finished', 5, 2, null, 'FT'),
    bb(6, 'Padres', 'Rockies', 'finished', 7, 4, null, 'FT'),
  ],
  proximos: [
    fb(8, 'Paraguay', 'Bolivia', 1, 'Torneo de Selecciones', 'scheduled', null, null, null, 'Sáb 14:00'),
    fb(9, 'México', 'Canadá', 1, 'Torneo de Selecciones', 'scheduled', null, null, null, 'Dom 18:30'),
    bb(7, 'Blue Jays', 'Mariners', 'scheduled', null, null, null, 'Vie 21:00'),
    bb(8, 'Twins', 'Guardians', 'scheduled', null, null, null, 'Sáb 17:00'),
  ],
}

export const MOCK_STANDINGS = {
  leagueId: 1,
  leagueName: 'Torneo de Selecciones',
  season: 2026,
  groups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((group) => ({
    group,
    rows: [
      {
        rank: 1,
        points: 6,
        goalsDiff: 3,
        group,
        all: { played: 2, win: 2, draw: 0, lose: 0, goals: { for: 5, against: 2 } },
        team: { id: 1, name: `Selección ${group}1`, national: true },
      },
      {
        rank: 2,
        points: 3,
        goalsDiff: 0,
        group,
        all: { played: 2, win: 1, draw: 0, lose: 1, goals: { for: 3, against: 3 } },
        team: { id: 2, name: `Selección ${group}2`, national: true },
      },
    ],
  })),
  flat: [],
}

export const MOCK_SCORERS = {
  leagueId: 1,
  season: 2026,
  scorers: [
    { rank: 1, playerName: 'Delantero A', teamName: 'Selección A1', goals: 4, assists: 1 },
    { rank: 2, playerName: 'Delantero B', teamName: 'Selección B2', goals: 3, assists: 2 },
    { rank: 3, playerName: 'Mediocampista C', teamName: 'Selección C1', goals: 2, assists: 3 },
  ],
}
