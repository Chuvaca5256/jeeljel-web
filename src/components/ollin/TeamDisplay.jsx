import { buildTeamDisplay } from '../../ollin/teamDisplay'

/**
 * Muestra identificador visual Ollin: bandera (selección) o círculo con iniciales (club).
 * Nunca usa escudos oficiales de federaciones ni clubes.
 */
export default function TeamDisplay({ team, size = 40, className = '' }) {
  const display = buildTeamDisplay(team)
  const dimension = typeof size === 'number' ? `${size}px` : size

  if (display.type === 'flag' && display.flagUrl) {
    return (
      <img
        src={display.flagUrl}
        alt={display.name ? `Bandera ${display.name}` : 'Bandera'}
        width={size}
        height={Math.round(Number(size) * 0.75) || 30}
        className={className}
        loading="lazy"
        style={{ objectFit: 'cover', borderRadius: '2px' }}
      />
    )
  }

  return (
    <span
      className={className}
      aria-hidden={!display.name}
      title={display.name}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dimension,
        height: dimension,
        borderRadius: '50%',
        backgroundColor: display.color,
        color: '#ffffff',
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 700,
        fontSize: `calc(${dimension} * 0.38)`,
        letterSpacing: '0.04em',
        flexShrink: 0,
      }}
    >
      {display.initials}
    </span>
  )
}
