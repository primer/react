export function isMacOS(): boolean {
  return /^mac/i.test(window.navigator.platform)
}
