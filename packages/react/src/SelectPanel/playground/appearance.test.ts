import {describe, expect, it} from 'vitest'
import {getContrast} from 'color2k'
import {appearanceStops, getAppearance} from './appearance'

describe('SelectPanel playground appearance', () => {
  it('names every exact stop and describes its inspiration', () => {
    expect(appearanceStops.map(stop => stop.name)).toEqual([
      'Primer',
      'Base UI-inspired',
      'GitHub App',
      'Windows 98',
      'Paper',
      'Terminal',
    ])
    for (const [position, stop] of appearanceStops.entries()) {
      expect(getAppearance(position).label).toBe(stop.name)
      expect(stop.description.length).toBeGreaterThan(0)
    }
    expect(appearanceStops[1].description).toContain('headless')
  })

  it.each([
    [0, '14px', '8px', '8px', 'rgba(255, 255, 255, 1)'],
    [1, '14px', '8px', '8px', 'rgba(255, 255, 255, 1)'],
    [2, '13px', '12px', '8px', 'rgba(255, 255, 255, 1)'],
    [3, '12px', '0px', '0px', 'rgba(192, 192, 192, 1)'],
    [4, '14px', '3px', '4px', 'rgba(255, 252, 244, 1)'],
    [5, '12px', '0px', '0px', 'rgba(18, 27, 22, 1)'],
  ])('returns the exact dimensions and surface at stop %s', (position, fontSize, radius, controlRadius, surface) => {
    const {style} = getAppearance(position as number)
    expect(style['--playground-font-size']).toBe(fontSize)
    expect(style['--playground-panel-radius']).toBe(radius)
    expect(style['--playground-control-radius']).toBe(controlRadius)
    expect(style['--playground-panel-bg']).toBe(surface)
  })

  it('provides square bevels and navy selection at the historical endpoint', () => {
    const {style} = getAppearance(3)
    expect(style['--playground-bevel-width']).toBe('1px')
    expect(style['--playground-border-width']).toBe('2px')
    expect(style['--playground-selected-bg']).toBe('rgba(0, 0, 128, 1)')
    expect(style['--playground-selected-text']).toBe('rgba(255, 255, 255, 1)')
    expect(style['--playground-shadow-blur']).toBe('0px')
    expect(style['--playground-font-family']).toContain('Tahoma')
  })

  it('linearly interpolates dimensions, density, and color between modern skins', () => {
    const {style} = getAppearance(1.5)
    expect(style['--playground-font-size']).toBe('13.5px')
    expect(style['--playground-panel-radius']).toBe('10px')
    expect(style['--playground-row-min-height']).toBe('30px')
    expect(style['--playground-row-padding-y']).toBe('5px')
    expect(style['--playground-line-height']).toBe(1.5192)
    expect(style['--playground-text']).toBe('rgba(27.5, 27.5, 29, 1)')
    expect(style['--playground-shadow-color']).toBe('rgba(10, 10, 15, 0.12)')
  })

  it('interpolates the first and last intervals instead of snapping', () => {
    expect(getAppearance(0.5).style['--playground-control-bg']).toBe('rgba(250.5, 251.5, 252.5, 1)')
    const {style} = getAppearance(2.5)
    expect(style['--playground-panel-radius']).toBe('6px')
    expect(style['--playground-font-size']).toBe('12.5px')
    expect(style['--playground-border-width']).toBe('1.5px')
    expect(style['--playground-bevel-width']).toBe('0.5px')
    expect(style['--playground-panel-bg']).toBe('rgba(223.5, 223.5, 223.5, 1)')
    expect(style['--playground-selected-bg']).toBe('rgba(119, 119, 184, 1)')
    expect(getAppearance(2.25).style['--playground-panel-radius']).toBe('9px')
    expect(getAppearance(2.75).style['--playground-panel-radius']).toBe('3px')
  })

  it('corrects unreadable blended text without changing its interpolated surface', () => {
    const {style} = getAppearance(2.5)
    expect(getContrast('rgb(144, 144, 145)', style['--playground-selected-bg'])).toBeLessThan(4.5)
    expect(style['--playground-selected-bg']).toBe('rgba(119, 119, 184, 1)')
    expect(style['--playground-selected-text']).toBe('rgba(0, 0, 0, 1)')
    expect(style['--playground-header-text']).toBe('rgba(0, 0, 0, 1)')
    expect(style['--playground-action-text']).toBe('rgba(255, 255, 255, 1)')
    expect(getAppearance(3).style['--playground-stage-text']).toBe('rgba(255, 255, 255, 1)')
  })

  it.each(Array.from({length: (appearanceStops.length - 1) * 100 + 1}, (_, index) => index / 100))(
    'keeps normal text at or above 4.5:1 contrast at position %s',
    position => {
      const {style} = getAppearance(position)
      const pairs = [
        ['stage-text', 'stage-bg'],
        ['selected-text', 'selected-bg'],
        ['header-text', 'header-bg'],
        ['action-text', 'action-bg'],
        ['text', 'panel-bg'],
        ['text', 'control-bg'],
        ['text', 'search-bg'],
        ['text', 'hover-bg'],
        ['muted', 'panel-bg'],
        ['muted', 'control-bg'],
        ['muted', 'search-bg'],
        ['muted', 'hover-bg'],
      ] as const

      for (const [foreground, background] of pairs) {
        const foregroundChannels = style[`--playground-${foreground}`].slice(5, -1).split(',').slice(0, 3).map(Number)
        const backgroundChannels = style[`--playground-${background}`].slice(5, -1).split(',').slice(0, 3).map(Number)
        for (const foregroundRound of [Math.floor, Math.ceil]) {
          for (const backgroundRound of [Math.floor, Math.ceil]) {
            expect(
              getContrast(
                `rgb(${foregroundChannels.map(foregroundRound).join(', ')})`,
                `rgb(${backgroundChannels.map(backgroundRound).join(', ')})`,
              ),
              `${foreground} on ${background}`,
            ).toBeGreaterThanOrEqual(4.5)
          }
        }
      }
    },
  )

  it.each([
    [0.25, 'Primer 75% / Base UI-inspired 25%'],
    [1.5, 'Base UI-inspired 50% / GitHub App 50%'],
    [2.75, 'GitHub App 25% / Windows 98 75%'],
    [1.333, 'Base UI-inspired 66.7% / GitHub App 33.3%'],
  ])('describes both endpoints and their percentages at %s', (position, label) => {
    expect(getAppearance(position).label).toBe(label)
  })

  it('returns fresh styles without mutating its endpoints', () => {
    const first = getAppearance(0)
    const second = getAppearance(0)
    expect(first).toEqual(second)
    expect(first.style).not.toBe(second.style)
    Object.assign(first.style, {'--playground-panel-radius': '99px'})
    expect(getAppearance(0).style['--playground-panel-radius']).toBe('8px')
  })

  it('uses only namespaced custom properties', () => {
    expect(Object.keys(getAppearance(1.5).style).every(key => key.startsWith('--playground-'))).toBe(true)
  })

  it.each([-1, -0.001, 5.001, 6, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'rejects invalid position %s',
    position => {
      expect(() => getAppearance(position)).toThrow(RangeError)
    },
  )
})
