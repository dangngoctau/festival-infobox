/**
 * Resolve event field by language.
 * Falls back to Vietnamese if English field is missing.
 */
export function getEventText(event, field, language) {
  if (language === 'en') {
    const enField = `${field}En`
    return event[enField] || event[field]
  }
  return event[field]
}

/**
 * Resolve location name by language.
 * Falls back to Vietnamese if English field is missing.
 */
export function getLocationText(location, field, language) {
  if (language === 'en') {
    const enField = `${field}En`
    return location[enField] || location[field]
  }
  return location[field]
}
