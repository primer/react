import {describe, expect, it} from 'vitest'
import {getShowcaseFrame, showcaseAppearanceOrder, SHOWCASE_DURATION} from './showcase'
import {
  convertShowcaseTime,
  DEFAULT_SHOWCASE_LAYOUT,
  getShowcaseChapters,
  getShowcaseDuration,
  getShowcasePlayback,
  SHOWCASE_INTRO_DURATION,
  SHOWCASE_NEXT_DURATION,
} from './showcasePlayback'

describe('SelectPanel showcase presentation timelines', () => {
  it('omits Style, puts Primer last, and uses faster theme intervals in both layouts', () => {
    expect(DEFAULT_SHOWCASE_LAYOUT).toBe('slideshow')
    expect(getShowcaseDuration('split')).toBe(54_000)
    expect(getShowcaseDuration('slideshow')).toBe(72_500)
    expect(getShowcaseChapters('split').map(chapter => chapter.playbackStart)).toEqual([
      0, 6_000, 12_000, 17_000, 26_000, 31_000, 43_000, 51_000,
    ])
    for (const layout of ['split', 'slideshow'] as const) {
      expect(getShowcaseChapters(layout).map(chapter => chapter.id)).toEqual([
        'familiar',
        'review',
        'details',
        'customize',
        'mobile',
        'platform',
        'next',
        'closing',
      ])
    }
    expect(getShowcaseChapters('slideshow').filter(chapter => chapter.introDuration > 0)).toHaveLength(5)
  })

  it.each([
    [0, 0, 1],
    [10_500, 6_000, 1],
    [21_000, 12_000, 1],
    [30_500, 20_000, 2],
    [44_000, 38_000, 1],
  ])('holds the script at %s ms until its full introduction completes', (start, scriptStart, rate) => {
    for (const time of [start, start + SHOWCASE_INTRO_DURATION - 1]) {
      expect(getShowcasePlayback(time, 'slideshow')).toMatchObject({
        phase: 'intro',
        scriptTime: scriptStart,
      })
    }
    expect(getShowcasePlayback(start + SHOWCASE_INTRO_DURATION, 'slideshow')).toMatchObject({
      phase: 'demo',
      scriptTime: scriptStart,
    })
    expect(getShowcasePlayback(start + SHOWCASE_INTRO_DURATION + 1, 'slideshow').scriptTime).toBe(scriptStart + rate)
  })

  it('ends with the existing Primer text card without an extra introduction', () => {
    for (const offset of [0, 2_999, 3_000, 4_999]) {
      expect(getShowcasePlayback(67_500 + offset, 'slideshow')).toMatchObject({
        phase: 'card',
        scriptTime: 55_000 + Math.min(offset, 2_999),
      })
    }
  })

  it('preserves every frame and its full timing when switching between demo layouts', () => {
    for (let elapsedMs = 0; elapsedMs <= getShowcaseDuration('split'); elapsedMs += 100) {
      const split = getShowcasePlayback(elapsedMs, 'split')
      expect(split.frame).toEqual(getShowcaseFrame(split.scriptTime))
      expect(split.phase).toBe(['next', 'closing'].includes(split.chapter.id) ? 'card' : 'split')
      const slideTime = convertShowcaseTime(elapsedMs, 'split', 'slideshow')
      expect(getShowcasePlayback(slideTime, 'slideshow').frame).toEqual(split.frame)
      expect(convertShowcaseTime(slideTime, 'slideshow', 'split')).toBeCloseTo(elapsedMs, 6)
    }
  })

  it('maps a paused introduction to the same chapter in split view rather than losing demo time', () => {
    expect(convertShowcaseTime(11_500, 'slideshow', 'split')).toBe(6_000)
    expect(convertShowcaseTime(11_500, 'slideshow', 'slideshow')).toBe(11_500)
  })

  it.each([
    [0, 'intro', 0, 4_500],
    [4_499, 'intro', 4_499, 4_500],
    [4_500, 'demo', 0, 6_000],
    [10_499, 'demo', 5_999, 6_000],
    [10_500, 'intro', 0, 4_500],
    [30_500, 'intro', 0, 4_500],
    [35_000, 'demo', 0, 9_000],
    [53_500, 'card', 0, 6_000],
    [59_500, 'card', 0, 8_000],
    [67_500, 'card', 0, 5_000],
    [72_500, 'card', 5_000, 5_000],
  ])('provides a phase-local animation clock at %s ms', (time, phase, phaseTime, phaseDuration) => {
    expect(getShowcasePlayback(time, 'slideshow')).toMatchObject({phase, phaseTime, phaseDuration})
  })

  it.each(['slideshow', 'split'] as const)('ends %s at the last canonical frame', layout => {
    expect(getShowcasePlayback(getShowcaseDuration(layout), layout).scriptTime).toBe(SHOWCASE_DURATION)
  })

  it.each(['slideshow', 'split'] as const)('places the presentation-only next chapter before Primer in %s', layout => {
    const chapters = getShowcaseChapters(layout)
    const next = chapters.at(-2)!
    expect(chapters.at(-1)?.id).toBe('closing')
    expect(next.id).toBe('next')
    expect(next.contentDuration).toBe(SHOWCASE_NEXT_DURATION)
    expect(next.introDuration).toBe(0)
    for (const offset of [0, 1_000, SHOWCASE_NEXT_DURATION - 1]) {
      expect(getShowcasePlayback(next.playbackStart + offset, layout)).toMatchObject({
        chapter: {id: 'next'},
        phase: 'card',
        phaseTime: offset,
        scriptTime: SHOWCASE_DURATION,
      })
    }
    expect(getShowcasePlayback(next.playbackStart + SHOWCASE_NEXT_DURATION, layout).chapter.id).toBe('closing')
  })

  it('preserves the final reading hold when switching layouts', () => {
    expect(convertShowcaseTime(72_000, 'slideshow', 'split')).toBe(53_700)
    expect(convertShowcaseTime(53_700, 'split', 'slideshow')).toBe(72_000)
  })

  it('replaces the native introduction and walkthrough with one six-second benefits card', () => {
    const native = getShowcaseChapters('slideshow').find(chapter => chapter.id === 'platform')!
    expect(native.introDuration).toBe(0)
    expect(native.contentDuration).toBe(6_000)
    expect(getShowcasePlayback(native.playbackStart + 5_999, 'slideshow').frame.scene.id).toBe('platform')
    expect(getShowcasePlayback(native.playbackStart + 6_000, 'slideshow').chapter.id).toBe('next')
    expect(convertShowcaseTime(37_000, 'split', 'slideshow')).toBe(56_500)
    expect(convertShowcaseTime(56_500, 'slideshow', 'split')).toBe(37_000)
  })

  it.each(['split', 'slideshow'] as const)('shows each theme for exactly 1.5 seconds in %s', layout => {
    const chapter = getShowcaseChapters(layout).find(candidate => candidate.id === 'customize')!
    const start = chapter.playbackStart + chapter.introDuration
    expect(chapter.contentDuration).toBe(9_000)
    for (const [index, appearance] of showcaseAppearanceOrder.entries()) {
      for (const offset of [0, 1_499]) {
        expect(getShowcasePlayback(start + index * 1_500 + offset, layout).frame.config.appearance).toBe(appearance)
      }
    }
    expect(getShowcasePlayback(start + 9_000, layout).frame.scene.id).toBe('mobile')
  })

  it.each([-1, 72_501, Number.NaN, Number.POSITIVE_INFINITY])('rejects invalid slideshow time %s', time => {
    expect(() => getShowcasePlayback(time, 'slideshow')).toThrow(RangeError)
  })

  it('does not accept an expanded slideshow timestamp as a split-view time', () => {
    expect(() => getShowcasePlayback(54_001, 'split')).toThrow(RangeError)
  })
})
