import { useEffect, useState } from 'react'
import {
  getLeagueLabel,
  getLeaguesByRegion,
  PREMIUM_LOCK_MESSAGE,
  SPORTS_NAV,
} from '../../ollin/leagueCatalog'
import PremiumLockNotice from './PremiumLockNotice'

function LeagueList({ sport, selectedLeagueId, liveCounts, onSelectLeague, onCloseMobile }) {
  const regions = getLeaguesByRegion(sport)

  return (
    <div className="ollin-sidebar__leagues-scroll">
      <button
        type="button"
        className={`ollin-sidebar__league${selectedLeagueId == null ? ' is-active' : ''}`}
        onClick={() => {
          onSelectLeague(null)
          onCloseMobile?.()
        }}
      >
        Todas las ligas
      </button>

      {regions.map(({ region, label, leagues }) =>
        leagues.length === 0 ? null : (
          <div key={region} className="ollin-sidebar__region">
            <h3 className="ollin-sidebar__region-title">{label}</h3>
            <ul className="ollin-sidebar__leagues">
              {leagues.map((league) => {
                const live = liveCounts[league.id] || 0
                const isActive = selectedLeagueId === league.id
                const name = getLeagueLabel(league.id, league.sport)

                return (
                  <li key={`${league.sport}-${league.id}`}>
                    <button
                      type="button"
                      className={`ollin-sidebar__league${isActive ? ' is-active' : ''}`}
                      onClick={() => {
                        onSelectLeague(league.id)
                        onCloseMobile?.()
                      }}
                      title={league.premiumOnly ? PREMIUM_LOCK_MESSAGE : undefined}
                    >
                      <span className="ollin-sidebar__league-name">
                        {league.premiumOnly && (
                          <span className="ollin-sidebar__lock" aria-hidden>
                            🔒
                          </span>
                        )}
                        {name}
                      </span>
                      {live > 0 && (
                        <span className="ollin-sidebar__live-badge">{live}</span>
                      )}
                    </button>
                    {league.premiumOnly && isActive && <PremiumLockNotice />}
                  </li>
                )
              })}
            </ul>
          </div>
        )
      )}
    </div>
  )
}

export default function LeagueSidebar({
  sport,
  selectedLeagueId,
  liveCounts,
  onSelectSport,
  onSelectLeague,
  onCloseMobile,
}) {
  const [leaguesOpen, setLeaguesOpen] = useState(false)

  useEffect(() => {
    setLeaguesOpen(false)
  }, [sport])

  const handleSelectSport = (sportId) => {
    if (sportId !== sport) {
      setLeaguesOpen(false)
    }
    onSelectSport(sportId)
    onSelectLeague(null)
  }

  return (
    <aside className="ollin-sidebar">
      <div className="ollin-sidebar__section">
        <h2 className="ollin-sidebar__heading">Deportes</h2>
        <ul className="ollin-sidebar__sports">
          {SPORTS_NAV.map((s) => {
            const isActive = sport === s.id
            const showToggle = isActive && s.enabled

            return (
              <li key={s.id} className="ollin-sidebar__sport-item">
                <div className="ollin-sidebar__sport-row">
                  <button
                    type="button"
                    className={`ollin-sidebar__sport${isActive ? ' is-active' : ''}${!s.enabled ? ' is-disabled' : ''}`}
                    disabled={!s.enabled}
                    onClick={() => {
                      if (s.enabled) handleSelectSport(s.id)
                    }}
                  >
                    <span>{s.label}</span>
                    {!s.enabled && s.phase2 && (
                      <span className="ollin-sidebar__phase">Fase 2</span>
                    )}
                  </button>

                  {showToggle && (
                    <button
                      type="button"
                      className="ollin-sidebar__toggle"
                      aria-expanded={leaguesOpen}
                      aria-label={leaguesOpen ? 'Cerrar ligas' : 'Ver ligas'}
                      onClick={() => setLeaguesOpen((open) => !open)}
                    >
                      <span
                        className={`ollin-sidebar__toggle-arrow${!leaguesOpen ? ' is-blinking' : ''}`}
                        aria-hidden
                      >
                        {leaguesOpen ? '↑' : '↓'}
                      </span>
                    </button>
                  )}
                </div>

                {showToggle && (
                  <div
                    className={`ollin-sidebar__leagues-panel${leaguesOpen ? ' is-open' : ''}`}
                    aria-hidden={!leaguesOpen}
                  >
                    <div className="ollin-sidebar__leagues-inner">
                      <LeagueList
                        sport={s.id}
                        selectedLeagueId={selectedLeagueId}
                        liveCounts={liveCounts}
                        onSelectLeague={onSelectLeague}
                        onCloseMobile={onCloseMobile}
                      />
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
