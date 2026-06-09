const {
  STRONG_PROFANITY_ES,
  STRONG_PROFANITY_EN,
  HOMOPHOBIA,
  RACISM_DIRECT,
  RACISM_CONTEXTUAL_WORDS,
  INSULT_INTRODUCERS,
  CONTEXTUAL_ALLOW_PHRASES,
  URL_PATTERNS,
} = require('./chatFilter.terms')

const USER_BLOCK_MESSAGE =
  'Tu mensaje no fue enviado. En Ollin Deportes fomentamos la convivencia sana — sin insultos ni discriminación.'

const LEET_MAP = {
  '0': 'o',
  '1': 'i',
  '2': 'z',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '6': 'g',
  '7': 't',
  '8': 'b',
  '9': 'g',
  '@': 'a',
  '$': 's',
  '+': 't',
  v: 'u',
  w: 'u',
  ph: 'f',
}

const ALWAYS_BLOCK_TERMS = [
  ...STRONG_PROFANITY_ES,
  ...STRONG_PROFANITY_EN,
  ...HOMOPHOBIA,
  ...RACISM_DIRECT,
]

function stripAccents(text) {
  return text.normalize('NFD').replace(/\p{M}/gu, '')
}

function applyLeet(text) {
  let out = text
  out = out.replace(/ph/gi, 'f')
  for (const [from, to] of Object.entries(LEET_MAP)) {
    if (from.length === 1) {
      out = out.split(from).join(to)
      out = out.split(from.toUpperCase()).join(to)
    }
  }
  return out
}

function collapseRepeatedLetters(text) {
  return text.replace(/(.)\1{2,}/g, '$1')
}

/** Texto legible con espacios — para patrones contextuales */
function normalizeSoft(text) {
  if (!text || typeof text !== 'string') return ''
  let out = stripAccents(text.toLowerCase())
  out = out.replace(/[\u200B-\u200D\uFEFF]/g, '')
  out = out.replace(/\s+/g, ' ').trim()
  return out
}

/** Texto compacto anti-evasión — para términos de lista */
function normalizeCompact(text) {
  let out = normalizeSoft(text)
  out = applyLeet(out)
  out = out.replace(/[\s.\-_*/\\|·]+/g, '')
  out = collapseRepeatedLetters(out)
  return out
}

function containsTerm(compact, term) {
  const normalizedTerm = normalizeCompact(term)
  if (!normalizedTerm) return false
  return compact.includes(normalizedTerm)
}

function matchesAlwaysBlockTerms(compact) {
  for (const term of ALWAYS_BLOCK_TERMS) {
    if (containsTerm(compact, term)) {
      return { blocked: true, reason: 'profanity_or_slur', term }
    }
  }
  return { blocked: false }
}

function matchesContextualRacism(soft, compact) {
  for (const allowPattern of CONTEXTUAL_ALLOW_PHRASES) {
    if (allowPattern.test(soft)) {
      return { blocked: false }
    }
  }

  for (const word of RACISM_CONTEXTUAL_WORDS) {
    const wordCompact = normalizeCompact(word)
    if (!compact.includes(wordCompact)) continue

    if (new RegExp(`^${wordCompact}$`).test(compact)) {
      return { blocked: true, reason: 'racism_context', term: word }
    }

    for (const intro of INSULT_INTRODUCERS) {
      const introCompact = normalizeCompact(intro)
      const pattern = new RegExp(`${introCompact}${wordCompact}`)
      if (pattern.test(compact)) {
        return { blocked: true, reason: 'racism_context', term: `${intro} ${word}` }
      }
    }

    const insultPrefix = new RegExp(
      `\\b(?:${INSULT_INTRODUCERS.map((i) => stripAccents(i)).join('|')})\\s+${word}\\b`,
      'i'
    )
    if (insultPrefix.test(soft)) {
      return { blocked: true, reason: 'racism_context', term: word }
    }
  }

  return { blocked: false }
}

function matchesSpamUrl(original) {
  for (const pattern of URL_PATTERNS) {
    if (pattern.test(original)) {
      return { blocked: true, reason: 'spam_url' }
    }
  }
  return { blocked: false }
}

/**
 * Evalúa un mensaje antes de publicarlo.
 * @returns {{ allowed: boolean, reason?: string, userMessage?: string, normalized?: string }}
 */
function evaluateChatMessage(message) {
  if (!message || typeof message !== 'string') {
    return {
      allowed: false,
      reason: 'empty',
      userMessage: USER_BLOCK_MESSAGE,
    }
  }

  const trimmed = message.trim()
  if (trimmed.length === 0 || trimmed.length > 200) {
    return {
      allowed: false,
      reason: trimmed.length > 200 ? 'too_long' : 'empty',
      userMessage: USER_BLOCK_MESSAGE,
    }
  }

  const urlCheck = matchesSpamUrl(trimmed)
  if (urlCheck.blocked) {
    return { allowed: false, reason: urlCheck.reason, userMessage: USER_BLOCK_MESSAGE }
  }

  const soft = normalizeSoft(trimmed)
  const compact = normalizeCompact(trimmed)

  const contextual = matchesContextualRacism(soft, compact)
  if (contextual.blocked) {
    return {
      allowed: false,
      reason: contextual.reason,
      userMessage: USER_BLOCK_MESSAGE,
      term: contextual.term,
      normalized: compact,
    }
  }

  const terms = matchesAlwaysBlockTerms(compact)
  if (terms.blocked) {
    return {
      allowed: false,
      reason: terms.reason,
      userMessage: USER_BLOCK_MESSAGE,
      term: terms.term,
      normalized: compact,
    }
  }

  return { allowed: true, normalized: compact, soft }
}

module.exports = {
  USER_BLOCK_MESSAGE,
  normalizeSoft,
  normalizeCompact,
  evaluateChatMessage,
}
