const focusableSelector =
  'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, audio[controls], video[controls], [contenteditable]:not([contenteditable="false"]), [tabindex]:not([tabindex="-1"])'

function isVisible(candidate: HTMLElement) {
  if (candidate.closest('[hidden], [inert], [aria-hidden="true"]')) return false
  const view = candidate.ownerDocument.defaultView
  if (!view) return false

  for (let node: HTMLElement | null = candidate; node; node = node.parentElement) {
    const style = view.getComputedStyle(node)
    if (style.display === 'none' || style.getPropertyValue('content-visibility') === 'hidden') return false
    if (node === candidate && (style.visibility === 'hidden' || style.visibility === 'collapse')) return false
  }
  return true
}

export function isAvailableFocusTarget(candidate: HTMLElement) {
  return (
    candidate.matches(`${focusableSelector}, [tabindex]`) &&
    !candidate.matches(':disabled, input[type="hidden"]') &&
    !candidate.closest('[aria-disabled="true"]') &&
    isVisible(candidate)
  )
}

export function getFocusableChild(element: HTMLElement | null) {
  return [...(element?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])].find(isAvailableFocusTarget) ?? null
}
