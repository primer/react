import {describe, expect, it} from 'vitest'
import {defaultConfig, repositories} from './model'
import {
  getPlaygroundRecordingFrame,
  isPlaygroundRecordingConfig,
  playgroundRecordingCues,
  PLAYGROUND_RECORDING_COUNTDOWN,
  PLAYGROUND_RECORDING_DURATION,
} from './playgroundRecording'

describe('Playground recording timeline', () => {
  it('fits a complete recording, including the countdown, into 20 to 30 seconds', () => {
    expect(PLAYGROUND_RECORDING_DURATION).toBe(25_000)
    const duration = PLAYGROUND_RECORDING_DURATION + PLAYGROUND_RECORDING_COUNTDOWN
    expect(duration).toBeGreaterThanOrEqual(20_000)
    expect(duration).toBeLessThanOrEqual(30_000)
    expect(getPlaygroundRecordingFrame(0).config).toEqual(defaultConfig)
    expect(getPlaygroundRecordingFrame(0).preview.open).toBe(false)
  })

  it.each(playgroundRecordingCues.slice(1))('switches to "$label" at $at ms, not before', cue => {
    expect(getPlaygroundRecordingFrame(cue.at - 1).cue.at).toBeLessThan(cue.at)
    expect(getPlaygroundRecordingFrame(cue.at).cue).toBe(cue)
  })

  it('keeps draft selection separate until the save beat', () => {
    const ids = repositories.map(repository => repository.id)
    expect(getPlaygroundRecordingFrame(6_999).preview.selected).toEqual(ids.slice(0, 1))
    expect(getPlaygroundRecordingFrame(7_000).preview.committed).toEqual(ids.slice(0, 2))
    expect(getPlaygroundRecordingFrame(7_999).config.commitMode).toBe('immediate')
    expect(getPlaygroundRecordingFrame(8_000).config.commitMode).toBe('submit')
    expect(getPlaygroundRecordingFrame(9_000).preview.selected).toEqual(ids)
    expect(getPlaygroundRecordingFrame(9_999).preview.committed).toEqual(ids.slice(0, 2))
    expect(getPlaygroundRecordingFrame(10_000).preview.committed).toEqual(ids)
  })

  it('switches on anatomy and follows the demonstrated parts, pausing callouts during theme changes', () => {
    expect(getPlaygroundRecordingFrame(1_199).config.anatomy).toBe(false)
    expect(getPlaygroundRecordingFrame(1_200)).toMatchObject({
      config: {anatomy: true},
      preview: {anatomyPart: 'SearchInput'},
      cue: {target: 'anatomy'},
    })
    for (const [time, part] of [
      [2_000, 'Item.description'],
      [4_000, 'Group'],
      [6_000, 'Item'],
      [8_000, 'Footer'],
      [10_000, 'SubmitButton'],
      [11_000, null],
      [17_000, 'Trigger'],
      [18_200, 'List'],
      [20_000, 'Overlay'],
      [21_000, 'Loading'],
      [22_000, 'List'],
    ] as const) {
      expect(getPlaygroundRecordingFrame(time).preview.anatomyPart).toBe(part)
    }
    expect(getPlaygroundRecordingFrame(PLAYGROUND_RECORDING_DURATION).config.anatomy).toBe(true)
  })

  it.each([
    [10_999, 0],
    [11_000, 2],
    [12_200, 1],
    [13_400, 4],
    [14_600, 5],
    [15_800, 3],
    [17_000, 0],
  ])('uses appearance %s -> %s without losing selection', (time, appearance) => {
    const frame = getPlaygroundRecordingFrame(time)
    expect(frame.config.appearance).toBe(appearance)
    expect(frame.preview.selected).toHaveLength(3)
    expect(frame.preview.committed).toHaveLength(3)
  })

  it('changes presentation, real viewport, loading state, and source view at the intended boundaries', () => {
    expect(getPlaygroundRecordingFrame(18_199).config.presentation).toBe('anchored')
    expect(getPlaygroundRecordingFrame(18_200).config.presentation).toBe('inline')
    expect(getPlaygroundRecordingFrame(19_999).mobile).toBe(false)
    expect(getPlaygroundRecordingFrame(20_000)).toMatchObject({
      config: {presentation: 'anchored'},
      mobile: true,
    })
    expect(getPlaygroundRecordingFrame(20_999).config.previewState).toBe('ready')
    expect(getPlaygroundRecordingFrame(21_000).config.previewState).toBe('loading')
    expect(getPlaygroundRecordingFrame(22_000).config.previewState).toBe('ready')
    expect(getPlaygroundRecordingFrame(22_999).view).toBe('composition')
    expect(getPlaygroundRecordingFrame(23_000).view).toBe('code')
    expect(getPlaygroundRecordingFrame(PLAYGROUND_RECORDING_DURATION).view).toBe('code')
  })

  it('is deterministic on replay without mutating defaults or earlier frames', () => {
    const initial = getPlaygroundRecordingFrame(0)
    for (const cue of playgroundRecordingCues) getPlaygroundRecordingFrame(cue.at)
    expect(getPlaygroundRecordingFrame(0)).toEqual(initial)
    expect(defaultConfig).toEqual(initial.config)
    expect(getPlaygroundRecordingFrame(0).preview.selected).toEqual([repositories[0].id])
  })

  it.each([null, {}, {elapsedMs: '1'}, {elapsedMs: -1}, {elapsedMs: 25_001}, {elapsedMs: NaN}, {elapsedMs: Infinity}])(
    'rejects malformed or out-of-range preview messages: %j',
    value => {
      expect(isPlaygroundRecordingConfig(value)).toBe(false)
    },
  )

  it.each([-1, 25_001, NaN, Infinity])('fails explicitly for invalid timeline time %s', time => {
    expect(() => getPlaygroundRecordingFrame(time)).toThrow(RangeError)
  })
})
