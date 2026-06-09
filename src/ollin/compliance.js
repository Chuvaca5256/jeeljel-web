/** Reglas de cumplimiento legal — Ollin Deportes (UI, metadatos, URLs) */

export const OLLIN_LEGAL_DISCLAIMER =
  'Ollin Deportes es un servicio informativo independiente de estadísticas deportivas. No está afiliado, patrocinado ni respaldado por FIFA, ligas, federaciones, clubes ni organizadores de eventos. Todas las marcas, nombres y logotipos pertenecen a sus respectivos titulares y se mencionan únicamente con fines informativos y de identificación. Ollin Deportes no transmite video ni audio de ningún evento.'

/** Términos prohibidos en UI pública de Ollin Deportes */
const BANNED_REPLACEMENTS = [
  [/world\s*cup/gi, 'Fútbol internacional'],
  [/copa\s+(del\s+)?mundo/gi, 'Fútbol internacional'],
  [/copa\s+mundial/gi, 'Fútbol internacional'],
  [/mundial\s*2026/gi, 'fútbol internacional en vivo'],
  [/mundial/gi, 'fútbol internacional'],
  [/fifa/gi, ''],
]

export const AFFILIATE_COPY = {
  liveOdds: 'Momios en vivo',
  bettorMode: 'Modo Apostador',
}

export function sanitizeOllinText(text) {
  if (text == null || typeof text !== 'string') return text
  let out = text
  for (const [pattern, replacement] of BANNED_REPLACEMENTS) {
    out = out.replace(pattern, replacement)
  }
  return out.replace(/\s{2,}/g, ' ').trim()
}

/** Nombres de competición seguros por ID API-Football (evita marcas del torneo) */
export const LEAGUE_DISPLAY_NAMES = {
  2: 'Fútbol internacional — selecciones',
  3: 'Eurocopa',
  4: 'Copa América',
}
