import useTabData from '../../../hooks/useTabData'
import MatchGroupList from '../MatchGroupList'
import { normalizeFootballFixture, filterBySport, filterByLeague, filterBySearch, groupMatchesByLeague } from '../../../ollin/matchUtils'

export default function TabPasados({ sport, selectedLeagueId, searchQuery, active }) {
  const { loading, data } = useTabData(
    '/api/ollin/fixtures/pasados',
    active,
    (json) => (json.data ?? []).map(normalizeFootballFixture).filter(Boolean)
  )
  const matches = Array.isArray(data) ? data : []
  const filtered = filterBySearch(filterByLeague(filterBySport(matches, sport), selectedLeagueId, sport), searchQuery)
  const groups = groupMatchesByLeague(filtered)

  return (
    <MatchGroupList
      groups={groups}
      loading={loading}
      emptyIcon={sport === 'beisbol' ? '⚾' : '⚽'}
      emptyLabel="Sin partidos recientes"
    />
  )
}
