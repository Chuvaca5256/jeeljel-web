function formatDateYMD(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function todayKey() {
  return formatDateYMD(new Date())
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function nextDates(count) {
  const today = new Date()
  return Array.from({ length: count }, (_, i) => formatDateYMD(addDays(today, i)))
}

module.exports = {
  formatDateYMD,
  todayKey,
  addDays,
  nextDates,
}
