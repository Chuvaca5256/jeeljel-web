/**
 * Identificadores visuales Ollin — sin escudos oficiales.
 * Selecciones: bandera (flagcdn). Clubes: círculo con iniciales y colores propios.
 */

const FLAG_CDN = 'https://flagcdn.com'

/** Nombres de selecciones nacionales API-Sports (EN) → español */
const NATIONAL_TEAM_NAMES = {
  'South Korea': 'Corea del Sur',
  'Korea Republic': 'Corea del Sur',
  'Ivory Coast': 'Costa de Marfil',
  "Côte d'Ivoire": 'Costa de Marfil',
  "Cote d'Ivoire": 'Costa de Marfil',
  Sweden: 'Suecia',
  'Saudi Arabia': 'Arabia Saudita',
  Iran: 'Irán',
  Iraq: 'Irak',
  Uzbekistan: 'Uzbekistán',
  Haiti: 'Haití',
  Panama: 'Panamá',
  Ghana: 'Ghana',
  Australia: 'Australia',
  Qatar: 'Catar',
  'Cape Verde Islands': 'Islas Cabo Verde',
  'Cape Verde': 'Islas Cabo Verde',
  Norway: 'Noruega',
  'New Zealand': 'Nueva Zelanda',
  France: 'Francia',
  Spain: 'España',
  Uruguay: 'Uruguay',
  Senegal: 'Senegal',
  Argentina: 'Argentina',
  Mexico: 'México',
  Brazil: 'Brasil',
  Colombia: 'Colombia',
  Chile: 'Chile',
  Peru: 'Perú',
  Ecuador: 'Ecuador',
  Venezuela: 'Venezuela',
  Paraguay: 'Paraguay',
  Bolivia: 'Bolivia',
  'United States': 'Estados Unidos',
  USA: 'Estados Unidos',
  Canada: 'Canadá',
  'Costa Rica': 'Costa Rica',
  Honduras: 'Honduras',
  Jamaica: 'Jamaica',
  Curacao: 'Curazao',
  Curaçao: 'Curazao',
  Morocco: 'Marruecos',
  Tunisia: 'Túnez',
  Egypt: 'Egipto',
  Nigeria: 'Nigeria',
  Cameroon: 'Camerún',
  'South Africa': 'Sudáfrica',
  Algeria: 'Argelia',
  Japan: 'Japón',
  China: 'China',
  Jordan: 'Jordania',
  'United Arab Emirates': 'Emiratos Árabes Unidos',
  Oman: 'Omán',
  Syria: 'Siria',
  Palestine: 'Palestina',
  Indonesia: 'Indonesia',
  Thailand: 'Tailandia',
  Vietnam: 'Vietnam',
  India: 'India',
  Belgium: 'Bélgica',
  Netherlands: 'Países Bajos',
  Germany: 'Alemania',
  Italy: 'Italia',
  Portugal: 'Portugal',
  England: 'Inglaterra',
  Scotland: 'Escocia',
  Wales: 'Gales',
  'Northern Ireland': 'Irlanda del Norte',
  Switzerland: 'Suiza',
  Austria: 'Austria',
  Poland: 'Polonia',
  Croatia: 'Croacia',
  Serbia: 'Serbia',
  Denmark: 'Dinamarca',
  Finland: 'Finlandia',
  'Czech Republic': 'República Checa',
  Czechia: 'República Checa',
  Slovakia: 'Eslovaquia',
  Slovenia: 'Eslovenia',
  Hungary: 'Hungría',
  Romania: 'Rumania',
  Bulgaria: 'Bulgaria',
  Greece: 'Grecia',
  Turkey: 'Turquía',
  Ukraine: 'Ucrania',
  Russia: 'Rusia',
  Ireland: 'Irlanda',
  'Republic of Ireland': 'Irlanda',
  Iceland: 'Islandia',
  Albania: 'Albania',
  'Bosnia and Herzegovina': 'Bosnia y Herzegovina',
  'North Macedonia': 'Macedonia del Norte',
  Montenegro: 'Montenegro',
  Kosovo: 'Kosovo',
  Georgia: 'Georgia',
  Armenia: 'Armenia',
  Azerbaijan: 'Azerbaiyán',
  Kazakhstan: 'Kazajistán',
  Israel: 'Israel',
  Lebanon: 'Líbano',
  Kuwait: 'Kuwait',
  Bahrain: 'Baréin',
  Yemen: 'Yemen',
  Angola: 'Angola',
  Zambia: 'Zambia',
  'DR Congo': 'República Democrática del Congo',
  'Congo DR': 'República Democrática del Congo',
  Mali: 'Malí',
  'Burkina Faso': 'Burkina Faso',
  Togo: 'Togo',
  Benin: 'Benín',
  Gabon: 'Gabón',
  'Equatorial Guinea': 'Guinea Ecuatorial',
  Mozambique: 'Mozambique',
  Tanzania: 'Tanzania',
  Kenya: 'Kenia',
  Uganda: 'Uganda',
  Rwanda: 'Ruanda',
  Ethiopia: 'Etiopía',
  Sudan: 'Sudán',
  Libya: 'Libia',
  Mauritania: 'Mauritania',
  'Sierra Leone': 'Sierra Leona',
  Liberia: 'Liberia',
  'Guinea-Bissau': 'Guinea-Bissau',
  Guinea: 'Guinea',
  Gambia: 'Gambia',
  Namibia: 'Namibia',
  Botswana: 'Botsuana',
  Zimbabwe: 'Zimbabue',
  Malawi: 'Malaui',
  Madagascar: 'Madagascar',
  Comoros: 'Comoras',
  Suriname: 'Surinam',
  'Trinidad and Tobago': 'Trinidad y Tobago',
  'El Salvador': 'El Salvador',
  Guatemala: 'Guatemala',
  Nicaragua: 'Nicaragua',
  Cuba: 'Cuba',
  'Dominican Republic': 'República Dominicana',
  'Puerto Rico': 'Puerto Rico',
}

const NATIONAL_TEAM_NAMES_LOWER = Object.fromEntries(
  Object.entries(NATIONAL_TEAM_NAMES).map(([en, es]) => [en.toLowerCase(), es])
)

export function translateTeamName(name) {
  if (name == null || name === '') return name
  const str = String(name).trim()
  if (NATIONAL_TEAM_NAMES[str]) return NATIONAL_TEAM_NAMES[str]
  return NATIONAL_TEAM_NAMES_LOWER[str.toLowerCase()] ?? str
}

export function translateTeam(team) {
  if (!team) return team
  return {
    ...team,
    name: translateTeamName(team.name),
  }
}

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
    const displayName = translateTeamName(team.name)
    return {
      type: 'flag',
      name: displayName,
      flagUrl: countryFlagUrl(code),
      initials: teamInitials(displayName),
      color: teamAccentColor(team),
    }
  }

  return {
    type: 'initials',
    name: translateTeamName(team.name),
    initials: teamInitials(team.name),
    color: teamAccentColor(team),
    flagUrl: null,
  }
}
