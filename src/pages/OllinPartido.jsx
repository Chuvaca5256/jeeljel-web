import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import OllinLayout from '../components/ollin/OllinLayout'
import PartidoHeader from '../components/ollin/partido/PartidoHeader'
import PartidoSkeleton from '../components/ollin/partido/PartidoSkeleton'
import FootballFieldLive from '../components/ollin/partido/FootballFieldLive'
import BaseballDiamondLive from '../components/ollin/partido/BaseballDiamondLive'
import StatsTab from '../components/ollin/partido/StatsTab'
import PlayersTab from '../components/ollin/partido/PlayersTab'
import LineupsTab from '../components/ollin/partido/LineupsTab'
import H2HTab from '../components/ollin/partido/H2HTab'
import usePartido from '../hooks/usePartido'
import { resolveSport } from '../ollin/partidoMock'
import mosaico from '../assets/mosaicos/Macuilxochitl.png'
import './OllinDeportes.css'

const PARTIDO_TABS = [
  { id: 'live', label: 'EN VIVO' },
  { id: 'stats', label: 'ESTADÍSTICAS' },
  { id: 'players', label: 'JUGADORES' },
  { id: 'lineups', label: 'ALINEACIONES' },
  { id: 'h2h', label: 'H2H' },
]

export default function OllinPartido() {
  const { id } = useParams()
  const { loading, error, data } = usePartido(id)
  const [activeTab, setActiveTab] = useState('live')

  useEffect(() => {
    document.body.classList.add('page-ollin-deportes')
    return () => document.body.classList.remove('page-ollin-deportes')
  }, [])

  const summary = data?.summary
  const sport = resolveSport(summary, data)

  return (
    <OllinLayout pageTitle="Partido — Ollin Deportes">
      <div className="ollin-page">
        <div
          className="ollin-page__mosaic"
          style={{ backgroundImage: `url(${mosaico})` }}
          aria-hidden
        />

        <div className="ollin-partido-page">
          {loading && <PartidoSkeleton />}

          {!loading && error && (
            <div className="ollin-partido-unavailable">
              <h1>Partido no disponible</h1>
              <p>No pudimos cargar la información de este partido.</p>
              <Link to="/ollin-deportes" className="ollin-partido-back-btn">
                ← Volver a Ollin Deportes
              </Link>
            </div>
          )}

          {!loading && !error && data && (
            <>
              <PartidoHeader summary={summary} sport={sport} />

              <div className="ollin-partido-tabs" role="tablist" aria-label="Detalle del partido">
                {PARTIDO_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`ollin-partido-tabs__btn${activeTab === tab.id ? ' is-active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="ollin-partido-panel" role="tabpanel">
                {activeTab === 'live' &&
                  (sport === 'beisbol' ? (
                    <BaseballDiamondLive summary={summary} />
                  ) : (
                    <FootballFieldLive summary={summary} events={data.events} />
                  ))}

                {activeTab === 'stats' && (
                  <StatsTab statistics={data.statistics} sport={sport} summary={summary} />
                )}

                {activeTab === 'players' && (
                  <PlayersTab
                    players={data.players}
                    sport={sport}
                    summary={summary}
                    statistics={data.statistics}
                  />
                )}

                {activeTab === 'lineups' && (
                  <LineupsTab lineups={data.lineups} sport={sport} summary={summary} />
                )}

                {activeTab === 'h2h' && <H2HTab h2h={data.h2h} />}
              </div>
            </>
          )}
        </div>
      </div>
    </OllinLayout>
  )
}
