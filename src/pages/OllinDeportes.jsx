import './OllinDeportes.css'
import { useEffect, useMemo, useState } from 'react'
import OllinLayout from '../components/ollin/OllinLayout'
import MatchColumn from '../components/ollin/MatchColumn'
import useOllinData from '../hooks/useOllinData'
import { filterBySearch, filterBySport, sportHasMatches } from '../ollin/matchUtils'
import logoBalon from '../assets/Logo_JeelJel_Kanaabcon_balon_sin_fondo.png'
import mosaico from '../assets/mosaicos/Macuilxochitl.png'

const SPORTS = [
  { id: 'futbol', label: '⚽ Fútbol' },
  { id: 'beisbol', label: '⚾ Béisbol' },
]

const MOBILE_TABS = [
  { id: 'live', label: 'EN VIVO' },
  { id: 'hoy', label: 'HOY' },
  { id: 'pasados', label: 'PASADOS' },
  { id: 'proximos', label: 'PRÓXIMOS' },
]

export default function OllinDeportes() {
  const { loading, usingMock, categorized } = useOllinData()
  const [sport, setSport] = useState('futbol')
  const [mobileTab, setMobileTab] = useState('live')
  const [panelOpen, setPanelOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    document.body.classList.add('page-ollin-deportes')
    return () => document.body.classList.remove('page-ollin-deportes')
  }, [])

  const availableSports = useMemo(
    () => SPORTS.filter((s) => sportHasMatches(categorized, s.id)),
    [categorized]
  )

  useEffect(() => {
    if (availableSports.length === 0) return
    if (!availableSports.some((s) => s.id === sport)) {
      setSport(availableSports[0].id)
    }
  }, [availableSports, sport])

  const columns = useMemo(() => {
    const bySport = {
      live: filterBySport(categorized.live, sport),
      hoy: filterBySport(categorized.hoyScheduled, sport),
      pasados: filterBySport(categorized.hoyFinished, sport),
      proximos: filterBySport(categorized.proximos, sport),
    }
    return {
      live: filterBySearch(bySport.live, searchQuery),
      hoy: filterBySearch(bySport.hoy, searchQuery),
      pasados: filterBySearch(bySport.pasados, searchQuery),
      proximos: filterBySearch(bySport.proximos, searchQuery),
    }
  }, [categorized, sport, searchQuery])

  const emptyIcon = sport === 'beisbol' ? '⚾' : '⚽'
  const hasSearch = searchQuery.trim().length > 0
  const emptyLabel = hasSearch
    ? 'Sin resultados para tu búsqueda'
    : 'Sin partidos en este momento'

  const togglePanel = () => setPanelOpen((open) => !open)

  return (
    <OllinLayout pageTitle="Ollin Deportes">
      <div className="ollin-page">
        <div
          className="ollin-page__mosaic"
          style={{ backgroundImage: `url(${mosaico})` }}
          aria-hidden
        />

        <div className="ollin-page__inner">
          <header className="ollin-header">
            <img
              src={logoBalon}
              alt="Ollin Deportes"
              className="ollin-header__logo"
            />
            <div>
              <h1 className="ollin-header__title">OLLIN DEPORTES</h1>
              <p className="ollin-header__tagline">Estadísticas deportivas en tiempo real</p>
            </div>
          </header>

          {usingMock && (
            <div className="ollin-demo-banner" role="status">
              Modo demo — conectando al servidor...
            </div>
          )}

          {availableSports.length > 0 && (
            <div className="ollin-sports-section">
              <div className="ollin-sports" role="tablist" aria-label="Deportes">
                {availableSports.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={sport === s.id}
                    className={`ollin-sports__btn${sport === s.id ? ' is-active' : ''}`}
                    onClick={() => setSport(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="ollin-panel-toggle"
                onClick={togglePanel}
                aria-expanded={panelOpen}
                aria-controls="ollin-matches-panel"
              >
                <span
                  className={`ollin-panel-toggle__arrow${panelOpen ? ' is-open' : ''}`}
                  aria-hidden
                >
                  {panelOpen ? '↑' : '↓'}
                </span>
                <span className="ollin-panel-toggle__label">Ver partidos</span>
              </button>
            </div>
          )}

          <div
            id="ollin-matches-panel"
            className={`ollin-panel${panelOpen ? ' is-open' : ''}`}
          >
            <div className="ollin-panel__inner">
              <div className="ollin-search">
                <label className="ollin-search__wrap" htmlFor="ollin-match-search">
                  <span className="ollin-search__icon" aria-hidden>
                    🔍
                  </span>
                  <input
                    id="ollin-match-search"
                    type="search"
                    className="ollin-search__input"
                    placeholder="Buscar equipo o liga..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoComplete="off"
                  />
                </label>
              </div>

              <div className="ollin-mobile-tabs" role="tablist" aria-label="Columnas">
                {MOBILE_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={mobileTab === tab.id}
                    className={`ollin-mobile-tabs__btn${mobileTab === tab.id ? ' is-active' : ''}`}
                    onClick={() => setMobileTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="ollin-columns">
                <div
                  className={`ollin-columns__item${mobileTab === 'live' ? ' is-mobile-active' : ''}`}
                >
                  <MatchColumn
                    title="EN VIVO"
                    badge="live"
                    matches={columns.live}
                    loading={loading}
                    emptyIcon={emptyIcon}
                    emptyLabel={emptyLabel}
                  />
                </div>
                <div
                  className={`ollin-columns__item${mobileTab === 'hoy' ? ' is-mobile-active' : ''}`}
                >
                  <MatchColumn
                    title="HOY"
                    matches={columns.hoy}
                    loading={loading}
                    emptyIcon={emptyIcon}
                    emptyLabel={emptyLabel}
                  />
                </div>
                <div
                  className={`ollin-columns__item${mobileTab === 'pasados' ? ' is-mobile-active' : ''}`}
                >
                  <MatchColumn
                    title="PASADOS"
                    matches={columns.pasados}
                    loading={loading}
                    emptyIcon={emptyIcon}
                    emptyLabel={emptyLabel}
                  />
                </div>
                <div
                  className={`ollin-columns__item${mobileTab === 'proximos' ? ' is-mobile-active' : ''}`}
                >
                  <MatchColumn
                    title="PRÓXIMOS"
                    matches={columns.proximos}
                    loading={loading}
                    emptyIcon={emptyIcon}
                    emptyLabel={emptyLabel}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OllinLayout>
  )
}
