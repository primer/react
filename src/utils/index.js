
export function defined(val) {
  return val !== null && typeof val !== 'undefined'
}

export function definedFallback(input, fallback) {
  return defined(input) ? input : fallback
}
