import './OllinDeportes.css'
import { useEffect, useMemo, useState } from 'react'
import LeagueSidebar from '../components/ollin/LeagueSidebar'
import MatchGroupList from '../components/ollin/MatchGroupList'
import StandingsView from '../components/ollin/StandingsView'
import OllinLayout from '../components/ollin/OllinLayout'
import useOllinData from '../hooks/useOllinData'
import useStandings from '../hooks/useStandings'
import { CENTRAL_TABS, getLeagueMeta } from '../ollin/leagueCatalog'
import {
  countLiveByLeague,
  filterByLeague,
  filterBySearch,
  filterBySport,
  getMatchesForTab,
  groupMatchesByLeague,
} from '../ollin/matchUtils'
import logoBalon from '../assets/Logo_JeelJel_Kanaabcon_balon_sin_fondo.png'
import mosaico from '../assets/mosaicos/Macuilxochitl.png'

export default function OllinDeportes() {
  const { loading, usingMock, categorized } = useOllinData()
  const [sport, setSport] = useState('futbol')
  const [selectedLeagueId, setSelectedLeagueId] = useState(null)
  const [activeTab, setActiveTab] = useState('live')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const standingsLeagueId =
    selectedLeagueId ?? (sport === 'futbol' ? 1 : null)
  const { loading: standingsLoading, data: standingsData, usingMock: standingsMock } =
    useStandings(standingsLeagueId, activeTab === 'posiciones' && sport === 'futbol')

  useEffect(() => {
    document.body.classList.add('page-ollin-deportes')
    return () => document.body.classList.remove('page-ollin-deportes')
  }, [])

  const liveCounts = useMemo(
    () => countLiveByLeague(categorized.live, sport),
    [categorized.live, sport]
  )

  const matchGroups = useMemo(() => {
    if (activeTab === 'posiciones') return []

    const raw = getMatchesForTab(categorized, activeTab)
    const bySport = filterBySport(raw, sport)
    const byLeague = filterByLeague(bySport, selectedLeagueId, sport)
    const searched = filterBySearch(byLeague, searchQuery)
    const grouped = groupMatchesByLeague(searched)

    return grouped.map((g) => ({
      ...g,
      liveCount: g.matches.filter((m) => m.status === 'live').length,
    }))
  }, [activeTab, categorized, sport, selectedLeagueId, searchQuery])

  const emptyIcon = sport === 'beisbol' ? '⚾' : '⚽'
  const hasSearch = searchQuery.trim().length > 0
  const emptyLabel = hasSearch
    ? 'Sin resultados para tu búsqueda'
    : 'Sin partidos en este momento'

  const selectedLeagueMeta = getLeagueMeta(selectedLeagueId, sport)

  return (
    <OllinLayout pageTitle="Ollin Deportes">
      <div className="ollin-page">
        <div
          className="ollin-page__mosaic"
          style={{ backgroundImage: `url(${mosaico})` }}
          aria-hidden
        />

        <div className="ollin-shell">
          <header className="ollin-topbar">
            <button
              type="button"
              className="ollin-topbar__menu"
              aria-label="Abrir menú de ligas"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((o) => !o)}
            >
              ☰
            </button>
            <div className="ollin-topbar__brand">
              <img src={logoBalon} alt="" className="ollin-topbar__logo" />
              <div>
                <h1 className="ollin-topbar__title">OLLIN DEPORTES</h1>
                <p className="ollin-topbar__tagline">Estadísticas deportivas en tiempo real</p>
              </div>
            </div>
          </header>

          {usingMock && (
            <div className="ollin-demo-banner" role="status">
              Modo demo — conectando al servidor...
            </div>
          )}

          <div className="ollin-layout">
            <div
              className={`ollin-layout__overlay${sidebarOpen ? ' is-visible' : ''}`}
              onClick={() => setSidebarOpen(false)}
              aria-hidden={!sidebarOpen}
            />

            <div className={`ollin-layout__sidebar${sidebarOpen ? ' is-open' : ''}`}>
              <LeagueSidebar
                sport={sport}
                selectedLeagueId={selectedLeagueId}
                liveCounts={liveCounts}
                onSelectSport={setSport}
                onSelectLeague={setSelectedLeagueId}
                onCloseMobile={() => setSidebarOpen(false)}
              />
            </div>

            <main className="ollin-layout__main">
              <div className="ollin-search">
                <label className="ollin-search__wrap" htmlFor="ollin-global-search">
                  <span className="ollin-search__icon" aria-hidden>
                    🔍
                  </span>
                  <input
                    id="ollin-global-search"
                    type="search"
                    className="ollin-search__input"
                    placeholder="Buscar equipo o liga..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoComplete="off"
                  />
                </label>
              </div>

              <div className="ollin-tabs" role="tablist" aria-label="Vista de partidos">
                {CENTRAL_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`ollin-tabs__btn${activeTab === tab.id ? ' is-active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'posiciones' ? (
                <StandingsView
                  loading={standingsLoading}
                  data={standingsData}
                  usingMock={standingsMock}
                  leagueMeta={selectedLeagueMeta}
                />
              ) : (
                <MatchGroupList
                  groups={matchGroups}
                  loading={loading}
                  emptyIcon={emptyIcon}
                  emptyLabel={emptyLabel}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </OllinLayout>
  )
}
