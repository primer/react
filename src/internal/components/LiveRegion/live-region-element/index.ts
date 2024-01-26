import {LiveRegionElement, templateContent} from './element'
import type {AnnounceOptions} from './element'

type GlobalAnnounceOptions = AnnounceOptions & {
  appendTo?: HTMLElement
  from?: HTMLElement
}

export function announce(message: string, options: GlobalAnnounceOptions = {}) {
  const liveRegion = findOrCreateLiveRegion(options.from)
  liveRegion.announce(message, options)
}

export function announceFromElement(element: HTMLElement, options: GlobalAnnounceOptions = {}) {
  const liveRegion = findOrCreateLiveRegion(options.from ?? element)
  liveRegion.announceFromElement(element, options)
}

let liveRegion: LiveRegionElement | null = null

export function findOrCreateLiveRegion(from?: HTMLElement, appendTo?: HTMLElement): LiveRegionElement {
  if (liveRegion !== null) {
    return liveRegion
  }

  liveRegion = from?.closest('live-region') ?? null
  if (liveRegion !== null) {
    return liveRegion as LiveRegionElement
  }

  liveRegion = document.querySelector('live-region')
  if (liveRegion !== null) {
    return liveRegion as LiveRegionElement
  }

  liveRegion = document.createElement('live-region') as LiveRegionElement
  if (appendTo) {
    appendTo.appendChild(liveRegion)
  } else {
    document.documentElement.appendChild(liveRegion)
  }

  return liveRegion
}

export {LiveRegionElement, templateContent}
export type {AnnounceOptions}
