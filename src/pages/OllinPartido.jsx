import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import OllinLayout from '../components/ollin/OllinLayout'
import mosaico from '../assets/mosaicos/Macuilxochitl.png'
import './OllinDeportes.css'

export default function OllinPartido() {
  const { id } = useParams()

  useEffect(() => {
    document.body.classList.add('page-ollin-deportes')
    return () => document.body.classList.remove('page-ollin-deportes')
  }, [])

  return (
    <OllinLayout pageTitle="Partido — Ollin Deportes">
      <div className="ollin-page">
        <div
          className="ollin-page__mosaic"
          style={{ backgroundImage: `url(${mosaico})` }}
          aria-hidden
        />
        <div className="ollin-partido-stub">
          <div>
            <h1>PARTIDO</h1>
            <p>Vista de partido #{id} — próximamente.</p>
            <Link to="/ollin-deportes">← Volver a Ollin Deportes</Link>
          </div>
        </div>
      </div>
    </OllinLayout>
  )
}
