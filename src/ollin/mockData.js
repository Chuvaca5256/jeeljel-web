/** Datos demo cuando el backend no está disponible */

function fb(id, home, away, league, status, homeScore, awayScore, minute, hour) {
  return {
    id: `fb-${id}`,
    sport: 'futbol',
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
    fb(1, 'México', 'Brasil', 'Liga MX', 'live', 1, 1, 67, null),
    fb(2, 'Argentina', 'Colombia', 'Copa Libertadores', 'live', 2, 0, 34, null),
    bb(1, 'Yankees', 'Red Sox', 'live', 4, 3, '7° inning', null),
    bb(2, 'Dodgers', 'Giants', 'live', 2, 2, '5° inning', null),
  ],
  hoyScheduled: [
    fb(3, 'Chile', 'Perú', 'Eliminatorias CONMEBOL', 'scheduled', null, null, null, '20:00'),
    fb(4, 'España', 'Italia', 'La Liga', 'scheduled', null, null, null, '21:45'),
    bb(3, 'Cubs', 'Cardinals', 'scheduled', null, null, null, '19:10'),
    bb(4, 'Astros', 'Rangers', 'scheduled', null, null, null, '20:05'),
  ],
  hoyFinished: [
    fb(5, 'Uruguay', 'Ecuador', 'Copa Libertadores', 'finished', 3, 1, null, 'FT'),
    fb(6, 'Alemania', 'Francia', 'Bundesliga', 'finished', 0, 0, null, 'FT'),
    bb(5, 'Mets', 'Phillies', 'finished', 5, 2, null, 'FT'),
    bb(6, 'Padres', 'Rockies', 'finished', 7, 4, null, 'FT'),
  ],
  proximos: [
    fb(7, 'Portugal', 'Inglaterra', 'Premier League', 'scheduled', null, null, null, 'Sáb 14:00'),
    fb(8, 'Paraguay', 'Bolivia', 'Eliminatorias CONMEBOL', 'scheduled', null, null, null, 'Dom 18:30'),
    bb(7, 'Blue Jays', 'Mariners', 'scheduled', null, null, null, 'Vie 21:00'),
    bb(8, 'Twins', 'Guardians', 'scheduled', null, null, null, 'Sáb 17:00'),
  ],
}
