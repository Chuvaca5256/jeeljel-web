import { PREMIUM_LOCK_MESSAGE } from '../../ollin/leagueCatalog'

export default function PremiumLockNotice() {
  return (
    <div className="ollin-premium-lock" role="note">
      <span className="ollin-premium-lock__icon" aria-hidden>
        🔒
      </span>
      <span>{PREMIUM_LOCK_MESSAGE}</span>
    </div>
  )
}
