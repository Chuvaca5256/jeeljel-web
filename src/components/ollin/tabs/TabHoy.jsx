import useTabData from '../../../hooks/useTabData'
import MatchGroupList from '../MatchGroupList'
import { filterBySport, filterByLeague, filterBySearch, groupMatchesByLeague } from '../../../ollin/matchUtils'

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
    />
  )
}
