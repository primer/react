import {describe, expect, it} from 'vitest'
import {isPlaygroundConfig} from './model'
import {getShowcaseFrame, isShowcaseConfig, showcaseReviewers, showcaseScenes, SHOWCASE_DURATION} from './showcase'

const [first, second] = showcaseReviewers

describe('SelectPanel showcase timeline', () => {
  it.each([
    ['rickyzhangca', 'Ricky Zhang', 'https://avatars.githubusercontent.com/u/16908811?v=4'],
    ['adierkens', 'Adam Dierkens', 'https://avatars.githubusercontent.com/u/13004162?v=4'],
    ['TylerJDev', 'Tyler Jones', 'https://avatars.githubusercontent.com/u/26746305?v=4'],
    ['joshblack', 'Josh Black', 'https://avatars.githubusercontent.com/u/3901764?v=4'],
    ['francinelucca', 'Marie Lucca', 'https://avatars.githubusercontent.com/u/40550942?v=4'],
    ['tay1orjones', 'Taylor Jones', 'https://avatars.githubusercontent.com/u/3360588?v=4'],
  ])('uses the requested profile and avatar for %s', (id, description, avatarUrl) => {
    expect(showcaseReviewers.find(reviewer => reviewer.id === id)).toMatchObject({
      name: id,
      description,
      avatarUrl,
    })
  })

  it('covers a 58-second guided anatomy and native-platform tour with ordered, seekable chapters', () => {
    expect(SHOWCASE_DURATION).toBe(58_000)
    expect(showcaseScenes.map(scene => getShowcaseFrame(scene.start).scene.id)).toEqual(
      showcaseScenes.map(scene => scene.id),
    )
    for (let time = 0; time <= SHOWCASE_DURATION; time += 100) {
      const frame = getShowcaseFrame(time)
      expect(isPlaygroundConfig(frame.config)).toBe(true)
      expect(frame.scene.start).toBeLessThanOrEqual(time)
      expect(frame.selected.every(value => showcaseReviewers.some(reviewer => reviewer.id === value))).toBe(true)
      expect(frame.config.multiple || frame.selected.length <= 1).toBe(true)
    }
  })

  it('opens, types a query, selects a result and closes the familiar picker', () => {
    expect(getShowcaseFrame(0).open).toBe(false)
    expect(getShowcaseFrame(1_399).open).toBe(false)
    expect(getShowcaseFrame(1_400).open).toBe(true)
    expect(getShowcaseFrame(3_200 + second.id.length * 80).query).toBe(second.id)
    expect(getShowcaseFrame(5_400).selected).toEqual([second.id])
    expect(getShowcaseFrame(5_600)).toMatchObject({query: '', committed: [second.id]})
  })

  it('keeps draft selection separate until the scripted save', () => {
    expect(getShowcaseFrame(9_500)).toMatchObject({
      config: {multiple: true, grouped: true, commitMode: 'submit'},
      selected: [first.id, second.id],
      committed: [second.id],
      open: true,
    })
    expect(getShowcaseFrame(11_500)).toMatchObject({open: false, committed: [first.id, second.id]})
  })

  it('inspects details without changing selection and then demonstrates anchored skins and mobile layouts', () => {
    const details = getShowcaseFrame(15_500)
    expect(details.detailsOpen).toBe(true)
    expect(getShowcaseFrame(14_500)).toMatchObject({detailsOpen: false, selected: details.selected})
    expect(getShowcaseFrame(20_000)).toMatchObject({config: {presentation: 'anchored'}, open: true})
    expect(getShowcaseFrame(39_500)).toMatchObject({mobile: true, open: true})
    expect(getShowcaseFrame(43_000)).toMatchObject({mobile: false, open: false})
  })

  it('introduces customization with a three-second text card before showing themes', () => {
    expect(getShowcaseFrame(16_999).scene.id).toBe('details')
    for (const elapsedMs of [17_000, 19_999]) {
      expect(getShowcaseFrame(elapsedMs)).toMatchObject({
        scene: {id: 'customize-intro'},
        open: false,
        mobile: false,
        anatomyPart: null,
        keyCue: null,
      })
    }
    expect(getShowcaseFrame(20_000).scene.id).toBe('customize')
  })

  it('holds the closed mobile picker for 1.5 seconds before showing its fullscreen overlay', () => {
    for (const elapsedMs of [38_000, 39_499]) {
      expect(getShowcaseFrame(elapsedMs)).toMatchObject({
        scene: {id: 'mobile'},
        mobile: true,
        open: false,
        anatomyPart: 'Trigger',
        keyCue: {keys: 'Enter'},
      })
    }
    expect(getShowcaseFrame(39_500)).toMatchObject({open: true, anatomyPart: 'Overlay'})
    expect(getShowcaseFrame(40_499).anatomyPart).toBe('Overlay')
    expect(getShowcaseFrame(40_500).anatomyPart).toBe('Footer')
    expect(getShowcaseFrame(42_999)).toMatchObject({open: true, mobile: true, keyCue: {keys: 'Escape'}})
    expect(getShowcaseFrame(43_000)).toMatchObject({scene: {id: 'platform'}, open: false, mobile: false})
  })

  it.each([
    [43_000, 'dialog'],
    [46_000, 'anchors'],
    [49_000, 'popover'],
    [52_000, 'invokers'],
  ] as const)('shows the native %s ms feature for three full seconds', (start, id) => {
    for (const elapsedMs of [start, start + 2_999]) {
      expect(getShowcaseFrame(elapsedMs)).toMatchObject({
        scene: {id: 'platform'},
        platformFeature: {id},
        open: false,
        mobile: false,
        anatomyPart: null,
        keyCue: null,
      })
    }
    expect(getShowcaseFrame(start - 1).platformFeature?.id).not.toBe(id)
    expect(getShowcaseFrame(start + 3_000).platformFeature?.id).not.toBe(id)
    expect(getShowcaseFrame(55_000)).toMatchObject({
      scene: {id: 'closing'},
      platformFeature: null,
    })
  })

  it('cycles every skin with an unobstructed picker and the same selection', () => {
    const frames = [20_000, 23_000, 26_000, 29_000, 32_000, 35_000].map(getShowcaseFrame)
    expect(frames.map(frame => frame.config.appearance)).toEqual([0, 2, 1, 4, 5, 3])
    for (const frame of frames) {
      expect(frame.selected).toEqual([first.id, second.id])
      expect(frame.config.presentation).toBe('anchored')
      expect(frame.anatomyPart).toBeNull()
      expect(frame.keyCue).toBeNull()
      expect(frame.open).toBe(true)
    }
    expect(getShowcaseFrame(SHOWCASE_DURATION)).toMatchObject({scene: {id: 'closing'}, open: false})
  })

  it('supplies a local transition clock for each theme without extending the customization chapter', () => {
    expect(getShowcaseFrame(19_999).themeTransition).toBeNull()
    expect(getShowcaseFrame(20_000).themeTransition).toEqual({index: 0, elapsedMs: 0})
    expect(getShowcaseFrame(22_999).themeTransition).toEqual({index: 0, elapsedMs: 2_999})
    expect(getShowcaseFrame(23_000).themeTransition).toEqual({index: 1, elapsedMs: 0})
    expect(getShowcaseFrame(23_125).themeTransition).toEqual({index: 1, elapsedMs: 125})
    expect(getShowcaseFrame(37_999).themeTransition).toEqual({index: 5, elapsedMs: 2_999})
    expect(getShowcaseFrame(38_000).themeTransition).toBeNull()
  })

  it('accepts an optional boolean playback state for the isolated presentation surface', () => {
    expect(isShowcaseConfig({elapsedMs: 20_000})).toBe(true)
    expect(isShowcaseConfig({elapsedMs: 20_000, playing: true})).toBe(true)
    expect(isShowcaseConfig({elapsedMs: 20_000, playing: false})).toBe(true)
    expect(isShowcaseConfig({elapsedMs: 20_000, playing: 'true'})).toBe(false)
  })

  it.each([
    [20_000, 0],
    [23_000, 2],
    [26_000, 1],
    [29_000, 4],
    [32_000, 5],
    [35_000, 3],
  ])('holds the theme starting at %s ms for three full seconds', (start, appearance) => {
    for (const elapsedMs of [start, start + 2_999]) {
      expect(getShowcaseFrame(elapsedMs)).toMatchObject({
        scene: {id: 'customize'},
        config: {appearance},
        mobile: false,
        anatomyPart: null,
        keyCue: null,
      })
    }
    expect(getShowcaseFrame(start - 1)).not.toMatchObject({
      scene: {id: 'customize'},
      config: {appearance},
    })
  })

  it.each([
    [0, 'Trigger'],
    [1_400, 'Overlay'],
    [3_000, 'SearchInput'],
    [4_500, 'SearchInput.leadingVisual'],
    [6_000, 'List'],
    [7_500, 'Item'],
    [9_000, 'Footer'],
    [10_500, 'SubmitButton'],
    [11_500, 'Trigger'],
    [12_000, 'List'],
    [13_500, 'Item'],
    [14_500, 'Item.secondaryActions'],
    [15_500, null],
    [17_000, null],
    [20_000, null],
    [38_000, 'Trigger'],
    [39_500, 'Overlay'],
    [40_500, 'Footer'],
    [43_000, null],
  ] as const)('guides the anatomy to %s ms without pointer or focus input', (time, part) => {
    expect(getShowcaseFrame(time).anatomyPart).toBe(part)
  })

  it.each([
    [0, 'Enter'],
    [3_200, 'R'],
    [3_600, 'Z'],
    [4_080, 'A'],
    [4_900, 'ArrowDown'],
    [5_400, 'Enter'],
    [9_500, 'Space'],
    [10_200, 'Tab'],
    [11_500, 'Enter'],
    [14_500, 'Mod+Shift+U'],
    [16_500, 'Escape'],
    [38_000, 'Enter'],
    [40_500, 'ArrowDown'],
    [42_500, 'Escape'],
  ] as const)('shows the corresponding keyboard cue at %s ms', (time, keys) => {
    expect(getShowcaseFrame(time).keyCue?.keys).toBe(keys)
  })

  it.each([-1, SHOWCASE_DURATION + 1, Number.NaN, Number.POSITIVE_INFINITY])('rejects invalid time %s', elapsedMs => {
    expect(isShowcaseConfig({elapsedMs})).toBe(false)
    expect(() => getShowcaseFrame(elapsedMs)).toThrow(RangeError)
  })

  it.each([null, {}, {elapsedMs: '100'}, {elapsedMs: null}])('rejects malformed transport state %j', value => {
    expect(isShowcaseConfig(value)).toBe(false)
  })
})
