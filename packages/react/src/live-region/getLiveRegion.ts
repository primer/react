import type {LiveRegionElement} from '@primer/live-region-element'

const modalSelector = 'dialog, [aria-modal="true"][role="dialog"], [aria-modal="true"][role="alertdialog"]'

export function getLiveRegion(from?: HTMLElement | null): LiveRegionElement | null {
  const container = getLiveRegionContainer(from)
  return container.querySelector('live-region') as LiveRegionElement | null
}

export function getOrCreateLiveRegion(from?: HTMLElement | null): LiveRegionElement {
  const liveRegion = getLiveRegion(from)
  if (liveRegion) {
    return liveRegion
  }

  const container = getLiveRegionContainer(from)
  const createdLiveRegion = document.createElement('live-region') as LiveRegionElement
  container.appendChild(createdLiveRegion)
  return createdLiveRegion
}

export function clearLiveRegion(from?: HTMLElement | null) {
  getLiveRegion(from)?.clear()
}

function getLiveRegionContainer(from?: HTMLElement | null): HTMLElement {
  return (from?.closest(modalSelector) as HTMLElement | null) ?? document.body
}
