import { useEffect } from 'react'
import OllinLegalDisclaimer from './OllinLegalDisclaimer'
import { sanitizeOllinText } from '../../ollin/compliance'

/**
 * Layout base Ollin Deportes — incluye disclaimer legal obligatorio.
 * Usar en /ollin-deportes, /ollin-deportes/partido/:id y futuras páginas Ollin.
 */
export default function OllinLayout({ children, pageTitle = 'Ollin Deportes' }) {
  useEffect(() => {
    const safe = sanitizeOllinText(pageTitle)
    document.title = `${safe} | JeelJel Kaanab`
  }, [pageTitle])

  return (
    <>
      {children}
      <OllinLegalDisclaimer />
    </>
  )
}
