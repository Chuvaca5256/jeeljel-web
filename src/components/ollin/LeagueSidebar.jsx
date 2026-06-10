import {
  getLeagueLabel,
  getLeaguesByRegion,
  PREMIUM_LOCK_MESSAGE,
  SPORTS_NAV,
} from '../../ollin/leagueCatalog'
import PremiumLockNotice from './PremiumLockNotice'

export default function LeagueSidebar({
  sport,
  selectedLeagueId,
  liveCounts,
  onSelectSport,
  onSelectLeague,
  onCloseMobile,
}) {
  const regions = getLeaguesByRegion(sport)

  return (
    <aside className="ollin-sidebar">
      <div className="ollin-sidebar__section">
        <h2 className="ollin-sidebar__heading">Deportes</h2>
        <ul className="ollin-sidebar__sports">
          {SPORTS_NAV.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={`ollin-sidebar__sport${sport === s.id ? ' is-active' : ''}${!s.enabled ? ' is-disabled' : ''}`}
                disabled={!s.enabled}
                onClick={() => {
                  if (s.enabled) {
                    onSelectSport(s.id)
                    onSelectLeague(null)
                  }
                }}
              >
                {s.label}
                {!s.enabled && s.phase2 && (
                  <span className="ollin-sidebar__phase">Fase 2</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="ollin-sidebar__section ollin-sidebar__section--scroll">
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
    </aside>
  )
}
