import './OllinDeportes.css'
import { useEffect, useMemo, useState } from 'react'
import LeagueSidebar from '../components/ollin/LeagueSidebar'
import StandingsView from '../components/ollin/StandingsView'
import OllinLayout from '../components/ollin/OllinLayout'
import TabEnVivo from '../components/ollin/tabs/TabEnVivo'
import TabHoy from '../components/ollin/tabs/TabHoy'
import TabProximos from '../components/ollin/tabs/TabProximos'
import TabPasados from '../components/ollin/tabs/TabPasados'
import useStandings from '../hooks/useStandings'
import { CENTRAL_TABS, getLeagueMeta } from '../ollin/leagueCatalog'
import logoBalon from '../assets/Logo_JeelJel_Kanaabcon_balon_sin_fondo.png'
import mosaico from '../assets/mosaicos/Macuilxochitl.png'

export default function OllinDeportes() {
  const [sport, setSport] = useState('futbol')
  const [selectedLeagueId, setSelectedLeagueId] = useState(null)
  const [activeTab, setActiveTab] = useState('live')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const standingsLeagueId = selectedLeagueId ?? (sport === 'futbol' ? 1 : null)
  const { loading: standingsLoading, data: standingsData, scorers: scorersData, usingMock: standingsMock } =
    useStandings(standingsLeagueId, activeTab === 'posiciones' && sport === 'futbol')

  const selectedLeagueMeta = useMemo(() => getLeagueMeta(selectedLeagueId, sport), [selectedLeagueId, sport])

  useEffect(() => {
    document.body.classList.add('page-ollin-deportes')
    return () => document.body.classList.remove('page-ollin-deportes')
  }, [])

  const sharedProps = { sport, selectedLeagueId, searchQuery }

  return (
    <OllinLayout pageTitle="Ollin Deportes">
      <div className="ollin-page">
        <div className="ollin-page__mosaic" style={{ backgroundImage: `url(${mosaico})` }} aria-hidden />
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
                liveCounts={{}}
                onSelectSport={setSport}
                onSelectLeague={setSelectedLeagueId}
                onCloseMobile={() => setSidebarOpen(false)}
              />
            </div>

            <main className="ollin-layout__main">
              <div className="ollin-search">
                <label className="ollin-search__wrap" htmlFor="ollin-global-search">
                  <span className="ollin-search__icon" aria-hidden>🔍</span>
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
                    {tab.id === 'posiciones' ? (
                      <>
                        <span className="ollin-tabs__label ollin-tabs__label--desktop">POSICIONES</span>
                        <span className="ollin-tabs__label ollin-tabs__label--mobile">TABLA</span>
                      </>
                    ) : (
                      tab.label
                    )}
                  </button>
                ))}
              </div>

              <div style={{ display: activeTab === 'live' ? 'block' : 'none' }}>
                <TabEnVivo {...sharedProps} active={activeTab === 'live'} />
              </div>
              <div style={{ display: activeTab === 'hoy' ? 'block' : 'none' }}>
                <TabHoy {...sharedProps} active={activeTab === 'hoy'} />
              </div>
              <div style={{ display: activeTab === 'proximos' ? 'block' : 'none' }}>
                <TabProximos {...sharedProps} active={activeTab === 'proximos'} />
              </div>
              <div style={{ display: activeTab === 'pasados' ? 'block' : 'none' }}>
                <TabPasados {...sharedProps} active={activeTab === 'pasados'} />
              </div>
              {activeTab === 'posiciones' && (
                <StandingsView
                  loading={standingsLoading}
                  data={standingsData}
                  scorers={scorersData}
                  usingMock={standingsMock}
                  leagueMeta={selectedLeagueMeta}
                />
              )}

            </main>
          </div>
        </div>
      </div>
    </OllinLayout>
  )
}
