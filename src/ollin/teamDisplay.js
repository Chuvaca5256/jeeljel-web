/**
 * Identificadores visuales Ollin — sin escudos oficiales.
 * Selecciones: bandera (flagcdn). Clubes: círculo con iniciales y colores propios.
 */

const FLAG_CDN = 'https://flagcdn.com'

export function isNationalTeam(team) {
  return Boolean(team?.national)
}

export function countryFlagUrl(countryCode, size = '48x36') {
  const code = String(countryCode || '').trim().toLowerCase()
  if (!code || code.length !== 2) return null
  return `${FLAG_CDN}/${size}/${code}.png`
}

export function teamInitials(name) {
  if (!name) return '?'
  const words = String(name).trim().split(/\s+/).filter(Boolean)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

function hashColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 55%, 42%)`
}

export function teamAccentColor(team) {
  const fromApi = team?.colors?.primary || team?.colors?.player?.primary
  if (fromApi && typeof fromApi === 'string' && fromApi.startsWith('#')) {
    return fromApi
  }
  return hashColor(team?.name || 'team')
}

export function buildTeamDisplay(team) {
  if (!team) {
    return { type: 'initials', initials: '?', color: '#4ecdc4', flagUrl: null }
  }

  if (isNationalTeam(team)) {
    const code = team.country || team.code
    return {
      type: 'flag',
      name: team.name,
      flagUrl: countryFlagUrl(code),
      initials: teamInitials(team.name),
      color: teamAccentColor(team),
    }
  }

  return {
    type: 'initials',
    name: team.name,
    initials: teamInitials(team.name),
    color: teamAccentColor(team),
    flagUrl: null,
  }
}
