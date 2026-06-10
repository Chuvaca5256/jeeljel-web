/** Demo partido cuando el backend no responde */

const FOOTBALL_LIVE = {
  sport: 'futbol',
  summary: {
    id: 'demo-fb',
    sport: 'futbol',
    leagueId: 1,
    leagueName: 'Torneo de Selecciones',
    homeTeam: { name: 'México', national: true, country: 'mx' },
    awayTeam: { name: 'Brasil', national: true, country: 'br' },
    homeScore: 1,
    awayScore: 1,
    statusShort: '2H',
    statusLong: 'Segundo tiempo',
    elapsed: 67,
    date: new Date().toISOString(),
    possessionSide: 'home',
    miniStats: { possessionHome: '54%', possessionAway: '46%' },
  },
  statistics: {
    items: [
      { label: 'Posesión', home: '54%', away: '46%', suffix: '' },
      { label: 'Tiros totales', home: 11, away: 8, suffix: '' },
      { label: 'Tiros a puerta', home: 5, away: 3, suffix: '' },
      { label: 'Corners', home: 4, away: 2, suffix: '' },
      { label: 'Faltas', home: 9, away: 12, suffix: '' },
      { label: 'Tarjetas amarillas', home: 2, away: 1, suffix: '' },
      { label: 'Tarjetas rojas', home: 0, away: 0, suffix: '' },
    ],
  },
  events: [
    { minute: 12, label: 'GOL ⚽', player: 'Delantero Local' },
    { minute: 34, label: 'FALTA 🟨', player: 'Mediocampista Visitante' },
    { minute: 58, label: 'GOL ⚽', player: 'Delantero Visitante' },
  ],
  lineups: {
    home: {
      formation: '4-3-3',
      startXI: [
        { number: 1, name: 'Portero MX', pos: 'G', grid: '1:1' },
        { number: 4, name: 'Defensa MX', pos: 'D', grid: '2:2' },
        { number: 8, name: 'Medio MX', pos: 'M', grid: '3:2' },
        { number: 9, name: 'Delantero MX', pos: 'F', grid: '4:2' },
      ],
      substitutes: [{ number: 12, name: 'Suplente MX', pos: 'M' }],
    },
    away: {
      formation: '4-4-2',
      startXI: [
        { number: 1, name: 'Portero BR', pos: 'G', grid: '1:1' },
        { number: 5, name: 'Defensa BR', pos: 'D', grid: '2:3' },
        { number: 10, name: 'Medio BR', pos: 'M', grid: '3:3' },
        { number: 11, name: 'Delantero BR', pos: 'F', grid: '4:3' },
      ],
      substitutes: [],
    },
  },
  players: {
    home: [
      { name: 'Delantero MX', goals: 1, assists: 0, shots: 3, keyPasses: 1, minutes: 67, position: 'F' },
      { name: 'Medio MX', goals: 0, assists: 1, shots: 1, keyPasses: 4, minutes: 67, position: 'M' },
    ],
    away: [
      { name: 'Delantero BR', goals: 1, assists: 0, shots: 2, keyPasses: 0, minutes: 67, position: 'F' },
      { name: 'Medio BR', goals: 0, assists: 0, shots: 0, keyPasses: 2, minutes: 67, position: 'M' },
    ],
  },
  h2h: [
    {
      date: '2025-11-10T00:00:00Z',
      leagueName: 'Amistosos Internacionales',
      homeTeam: 'México',
      awayTeam: 'Brasil',
      homeScore: 2,
      awayScore: 2,
    },
    {
      date: '2024-06-08T00:00:00Z',
      leagueName: 'Torneo de Selecciones',
      homeTeam: 'Brasil',
      awayTeam: 'México',
      homeScore: 1,
      awayScore: 0,
    },
  ],
  updatedAt: new Date().toISOString(),
}

const BASEBALL_LIVE = {
  sport: 'beisbol',
  summary: {
    id: 'demo-bb',
    sport: 'beisbol',
    leagueId: 1,
    leagueName: 'MLB',
    homeTeam: { name: 'Rockies', national: false },
    awayTeam: { name: 'Cubs', national: false },
    homeScore: 2,
    awayScore: 0,
    statusShort: 'IN7',
    statusLong: '7° inning — Top',
    date: new Date().toISOString(),
    inning: '7° inning — Top',
    balls: 2,
    strikes: 1,
    outs: 1,
  },
  statistics: {
    items: [
      { label: 'Carreras', home: 2, away: 0 },
      { label: 'Hits', home: 6, away: 4 },
      { label: 'Errores', home: 0, away: 1 },
    ],
    meta: { inning: '7° Top', pitcherHome: 'Pitcher Local', pitcherAway: 'Pitcher Visitante' },
  },
  events: [{ label: 'HIT', player: 'Bateador Local' }],
  lineups: {
    home: {
      startXI: [
        { order: 1, name: 'Leadoff', position: 'CF' },
        { order: 2, name: 'Segundo', position: 'SS' },
        { order: 3, name: 'Cleanup', position: '1B' },
      ],
    },
    away: {
      startXI: [
        { order: 1, name: 'Leadoff AW', position: '2B' },
        { order: 2, name: 'Segundo AW', position: 'RF' },
      ],
    },
  },
  players: { home: [], away: [] },
  h2h: [],
  updatedAt: new Date().toISOString(),
}

export function getMockPartido(id) {
  const sid = String(id)
  if (sid.startsWith('bb-') || sid.includes('baseball')) {
    return { ...BASEBALL_LIVE, summary: { ...BASEBALL_LIVE.summary, id: sid } }
  }
  return { ...FOOTBALL_LIVE, summary: { ...FOOTBALL_LIVE.summary, id: sid } }
}

export function resolveSport(summary, data) {
  if (summary?.sport) return summary.sport
  if (data?.sport) return data.sport
  const leagueId = summary?.leagueId
  if ([1, 2, 5, 12, 17].includes(Number(leagueId)) && summary?.homeTeam && !summary.homeTeam.national) {
    return 'beisbol'
  }
  return 'futbol'
}
