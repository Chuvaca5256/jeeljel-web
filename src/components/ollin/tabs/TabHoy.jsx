import useTabData from '../../../hooks/useTabData'
import MatchGroupList from '../MatchGroupList'
import { filterBySport, filterByLeague, filterBySearch, groupMatchesByLeague } from '../../../ollin/matchUtils'

const getMatchTime = (fixture) => {
  const status = fixture?.fixture?.status
  const elapsed = status?.elapsed
  const short = status?.short

  if (short === 'HT') return 'ET'
  if (short === 'FT' || short === 'AET' || short === 'PEN') return 'FT'
  if (elapsed !== null && elapsed !== undefined) return `${elapsed}'`

  const date = fixture?.fixture?.date
  if (!date) return '--'
  return new Date(date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export default function TabHoy({ sport, selectedLeagueId, searchQuery, active }) {
  const { loading, data } = useTabData(
    '/api/ollin/fixtures/hoy',
    active,
    (json) => [...(json.futbol ?? []), ...(json.beisbol ?? [])]
  )
  const matches = Array.isArray(data) ? data : []
  const filtered = filterBySearch(filterByLeague(filterBySport(matches, sport), selectedLeagueId, sport), searchQuery)
  const groups = groupMatchesByLeague(filtered)

  return (
    <MatchGroupList
      groups={groups}
      loading={loading}
      emptyIcon={sport === 'beisbol' ? '⚾' : '⚽'}
      emptyLabel="Sin partidos programados para hoy"
      getMatchTime={getMatchTime}
    />
  )
}
