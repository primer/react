import '@primer/live-region-element'
import type {LiveRegionElement} from '@primer/live-region-element'
import {describe, expect, it, beforeEach, vi} from 'vitest'
import {clearLiveRegion, getOrCreateLiveRegion} from '../getLiveRegion'

describe('getLiveRegion', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('reuses an existing live-region inside an aria-modal dialog', () => {
    document.body.innerHTML = `
      <live-region id="global-live-region"></live-region>
      <div role="dialog" aria-modal="true">
        <div id="source"></div>
        <live-region id="modal-live-region"></live-region>
      </div>
    `

    const source = document.getElementById('source')!
    const liveRegion = getOrCreateLiveRegion(source)

    expect(liveRegion.id).toBe('modal-live-region')
    expect(document.querySelectorAll('live-region')).toHaveLength(2)
  })

  it('creates and reuses one live-region inside an aria-modal dialog', () => {
    document.body.innerHTML = `
      <live-region id="global-live-region"></live-region>
      <div role="dialog" aria-modal="true" id="modal">
        <div id="source"></div>
      </div>
    `

    const source = document.getElementById('source')!
    const firstLiveRegion = getOrCreateLiveRegion(source)
    const secondLiveRegion = getOrCreateLiveRegion(source)

    expect(firstLiveRegion).toBe(secondLiveRegion)
    expect(document.getElementById('modal')!.querySelectorAll('live-region')).toHaveLength(1)
    expect(document.querySelectorAll('live-region')).toHaveLength(2)
  })

  it('clears the live-region scoped to the source element', () => {
    document.body.innerHTML = `
      <live-region id="global-live-region"></live-region>
      <div role="dialog" aria-modal="true">
        <div id="source"></div>
        <live-region id="modal-live-region"></live-region>
      </div>
    `

    const source = document.getElementById('source')!
    const globalLiveRegion = document.getElementById('global-live-region') as LiveRegionElement
    const modalLiveRegion = document.getElementById('modal-live-region') as LiveRegionElement
    const globalClear = vi.spyOn(globalLiveRegion, 'clear')
    const modalClear = vi.spyOn(modalLiveRegion, 'clear')

    clearLiveRegion(source)

    expect(globalClear).not.toHaveBeenCalled()
    expect(modalClear).toHaveBeenCalled()
  })
})
