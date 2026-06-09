/**
 * Lista editable de términos — agregar palabras aquí sin tocar chatFilter.js
 */

/** Groserías fuertes — español */
const STRONG_PROFANITY_ES = [
  'pendejo',
  'pendeja',
  'pendejos',
  'pendejas',
  'cabron',
  'cabrona',
  'cabrones',
  'verga',
  'vergas',
  'chinga',
  'chingar',
  'chingada',
  'chingado',
  'chingados',
  'chingada',
  'mierda',
  'mierdas',
  'culero',
  'culera',
  'culeros',
  'coger',
  'carajo',
  'carajos',
  'pinche',
  'pinches',
  'hijo de puta',
  'hdp',
  'mamada',
  'mamadas',
  'perra',
  'perras',
  'zorra',
  'zorras',
  'concha',
  'conchas',
  'boludo',
  'boluda',
  'forro',
  'forra',
  'pelotudo',
  'pelotuda',
  'gilipollas',
  'capullo',
  'capulla',
]

/** Groserías fuertes — inglés */
const STRONG_PROFANITY_EN = [
  'fuck',
  'fucking',
  'fucker',
  'fuckers',
  'motherfucker',
  'shit',
  'shitty',
  'bitch',
  'bitches',
  'asshole',
  'bastard',
  'bastards',
  'cunt',
  'cunts',
  'dickhead',
  'dickheads',
  'whore',
  'whores',
  'slut',
  'sluts',
]

/** Homofobia — siempre bloqueado (incluye puto/puta como insulto) */
const HOMOPHOBIA = [
  'puto',
  'puta',
  'putos',
  'putas',
  'maricon',
  'marica',
  'maricas',
  'maricones',
  'joto',
  'jota',
  'jotos',
  'jotas',
  'punal',
  'mariposon',
  'mariposa',
  'faggot',
  'fag',
  'fags',
  'faggots',
  'fagot',
  'fagots',
  'fagget',
  'fagets',
]

/** Racismo — términos que se bloquean siempre (sin contexto) */
const RACISM_DIRECT = [
  'nigger',
  'niggers',
  'nigga',
  'niggas',
  'monkey',
  'monkeys',
  'simio',
  'simios',
]

/** Racismo contextual — solo bloquear con patrones compuestos (ver chatFilter.js) */
const RACISM_CONTEXTUAL_WORDS = ['negro', 'negra', 'negros', 'negras', 'mono', 'mona', 'monos', 'monas', 'indio', 'india', 'indios', 'indias', 'prieto', 'prieta', 'prietos', 'prietas', 'chango', 'changa', 'changos', 'changas']

/** Introductores de insulto para patrones contextuales */
const INSULT_INTRODUCERS = [
  'pinche',
  'pinchi',
  'ese',
  'esa',
  'esos',
  'esas',
  'eres',
  'maldito',
  'maldita',
  'malditos',
  'malditas',
  'puto',
  'puta',
  'putos',
  'putas',
  'mierda',
]

/** Frases permitidas aunque contengan palabras ambiguas */
const CONTEXTUAL_ALLOW_PHRASES = [
  /\bjersey\s+negro\b/,
  /\bcamiseta\s+negra?\b/,
  /\bplayera\s+negra?\b/,
  /\buniforme\s+negro\b/,
  /\bcolor\s+negro\b/,
  /\bjuega\s+de\s+negro\b/,
  /\bshort\s+negro\b/,
  /\bmedia\s+negra?\b/,
  /\bguante\s+negro\b/,
  /\bportero\s+de\s+negro\b/,
  /\bequipo\s+de\s+negro\b/,
  /\blinea\s+negra?\b/,
  /\bmono\s+de\s+carga\b/,
  /\bmono\s+industrial\b/,
]

/** Detección de URLs / spam de enlaces */
const URL_PATTERNS = [
  /https?:\/\//i,
  /\bwww\./i,
  /\b[a-z0-9-]+\.(com|net|org|io|co|mx|app|dev|me|tv|xyz|info|biz|us|uk|es|br|ar)(\/|\b|$)/i,
  /\bt\.me\b/i,
  /\bbit\.ly\b/i,
  /\bgoo\.gl\b/i,
]

module.exports = {
  STRONG_PROFANITY_ES,
  STRONG_PROFANITY_EN,
  HOMOPHOBIA,
  RACISM_DIRECT,
  RACISM_CONTEXTUAL_WORDS,
  INSULT_INTRODUCERS,
  CONTEXTUAL_ALLOW_PHRASES,
  URL_PATTERNS,
}
