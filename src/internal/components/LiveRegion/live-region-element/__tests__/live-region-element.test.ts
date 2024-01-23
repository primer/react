import '../define'
import {LiveRegionElement} from '../element'

describe('<live-region>', () => {
  let liveRegion: LiveRegionElement

  beforeEach(() => {
    liveRegion = document.createElement('live-region') as LiveRegionElement
    document.body.appendChild(liveRegion)
  })

  afterEach(() => {
    document.body.removeChild(liveRegion)
  })

  test('announce()', () => {
    liveRegion.announce('hello')
    expect(liveRegion.getMessage('polite')).toBe('hello')
  })

  test('announce() with politeness', () => {
    liveRegion.announce('polite message', {
      politeness: 'polite',
    })
    expect(liveRegion.getMessage('polite')).toBe('polite message')

    liveRegion.announce('assertive message', {
      politeness: 'assertive',
    })
    expect(liveRegion.getMessage('assertive')).toBe('assertive message')
  })

  test('announceFromElement()', () => {
    const element = document.createElement('div')
    element.textContent = 'message from element'
    liveRegion.announceFromElement(element)
    expect(liveRegion.getMessage('polite')).toBe('message from element')
  })
})
