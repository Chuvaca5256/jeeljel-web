import { OLLIN_LEGAL_DISCLAIMER } from '../../ollin/compliance'

export default function OllinLegalDisclaimer() {
  return (
    <footer
      className="ollin-legal-disclaimer"
      style={{
        maxWidth: '720px',
        margin: '48px auto 32px',
        padding: '20px 24px',
        borderTop: '1px solid rgba(78, 205, 196, 0.2)',
        textAlign: 'center',
      }}
    >
      <p
        className="font-dm"
        style={{
          fontSize: '12px',
          lineHeight: 1.7,
          color: 'rgba(255, 255, 255, 0.65)',
          margin: 0,
        }}
      >
        {OLLIN_LEGAL_DISCLAIMER}
      </p>
    </footer>
  )
}
