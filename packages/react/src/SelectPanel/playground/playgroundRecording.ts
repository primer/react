import {defaultConfig, repositories, type PlaygroundConfig} from './model'
import type {AnatomyPart} from './AnatomyInspector'

export const PLAYGROUND_RECORDING_DURATION = 25_000
export const PLAYGROUND_RECORDING_COUNTDOWN = 3_000

export interface PlaygroundRecordingConfig {
  elapsedMs: number
}

export interface PlaygroundDemoPlayback {
  open: boolean
  selected: string[]
  committed: string[]
  query: string
  anatomyPart: AnatomyPart | null
}

export const playgroundRecordingCues = [
  {at: 0, target: null, label: 'Start with a familiar picker', part: null},
  {at: 800, target: null, label: 'Open the repository picker', part: null},
  {at: 1_200, target: 'anatomy', label: 'Show the component anatomy', part: 'SearchInput'},
  {at: 2_000, target: 'structure', label: 'Add descriptions', part: 'Item.description'},
  {at: 4_000, target: 'structure', label: 'Group the collection', part: 'Group'},
  {at: 6_000, target: 'behavior', label: 'Enable multiple selection', part: 'Item'},
  {at: 7_000, target: 'behavior', label: 'Select another repository', part: 'Item'},
  {at: 8_000, target: 'behavior', label: 'Add Save and Cancel', part: 'Footer'},
  {at: 9_000, target: 'behavior', label: 'Make a draft selection', part: 'Footer'},
  {at: 10_000, target: 'behavior', label: 'Save the selection', part: 'SubmitButton'},
  {at: 11_000, target: 'appearance', label: 'GitHub App', part: null, appearance: 2},
  {at: 12_200, target: 'appearance', label: 'Base UI-inspired', part: null, appearance: 1},
  {at: 13_400, target: 'appearance', label: 'Paper', part: null, appearance: 4},
  {at: 14_600, target: 'appearance', label: 'Terminal', part: null, appearance: 5},
  {at: 15_800, target: 'appearance', label: 'Windows 98', part: 'Item', appearance: 3},
  {at: 17_000, target: 'appearance', label: 'Back to Primer', part: 'Trigger', appearance: 0},
  {at: 18_200, target: 'presentation', label: 'Embed the same collection inline', part: 'List'},
  {at: 20_000, target: 'viewport', label: 'Adapt the picker to mobile', part: 'Overlay'},
  {at: 21_000, target: 'presentation', label: 'Show a loading state', part: 'Loading'},
  {at: 22_000, target: 'presentation', label: 'Bring the collection back', part: 'List'},
  {at: 23_000, target: 'code', label: 'Take the composition with you', part: null},
] as const satisfies readonly {
  at: number
  target: string | null
  label: string
  part: AnatomyPart | null
  appearance?: number
}[]

export interface PlaygroundRecordingFrame {
  config: PlaygroundConfig
  presetId: 'repositories' | 'custom'
  view: 'composition' | 'code'
  mobile: boolean
  preview: PlaygroundDemoPlayback
  cue: (typeof playgroundRecordingCues)[number]
}

export function isPlaygroundRecordingConfig(value: unknown): value is PlaygroundRecordingConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    'elapsedMs' in value &&
    typeof value.elapsedMs === 'number' &&
    Number.isFinite(value.elapsedMs) &&
    value.elapsedMs >= 0 &&
    value.elapsedMs <= PLAYGROUND_RECORDING_DURATION
  )
}

export function getPlaygroundRecordingFrame(elapsedMs: number): PlaygroundRecordingFrame {
  if (!isPlaygroundRecordingConfig({elapsedMs})) {
    throw new RangeError(`Playground recording time must be between 0 and ${PLAYGROUND_RECORDING_DURATION}ms.`)
  }
  const cue = [...playgroundRecordingCues].reverse().find(candidate => elapsedMs >= candidate.at)!
  const appearance = playgroundRecordingCues.reduce(
    (current, candidate) => (candidate.at <= elapsedMs && 'appearance' in candidate ? candidate.appearance : current),
    0,
  )
  const selectedCount = elapsedMs >= 9_000 ? 3 : elapsedMs >= 7_000 ? 2 : 1
  const committedCount = elapsedMs >= 10_000 ? 3 : elapsedMs >= 7_000 ? 2 : 1
  return {
    config: {
      ...defaultConfig,
      anatomy: elapsedMs >= 1_200,
      appearance,
      descriptions: elapsedMs >= 2_000,
      grouped: elapsedMs >= 4_000,
      multiple: elapsedMs >= 6_000,
      commitMode: elapsedMs >= 8_000 ? 'submit' : 'immediate',
      presentation: elapsedMs >= 18_200 && elapsedMs < 20_000 ? 'inline' : 'anchored',
      previewState: elapsedMs >= 21_000 && elapsedMs < 22_000 ? 'loading' : 'ready',
    },
    presetId: elapsedMs >= 2_000 ? 'custom' : 'repositories',
    view: elapsedMs >= 23_000 ? 'code' : 'composition',
    mobile: elapsedMs >= 20_000,
    preview: {
      open: elapsedMs >= 800,
      selected: repositories.slice(0, selectedCount).map(repository => repository.id),
      committed: repositories.slice(0, committedCount).map(repository => repository.id),
      query: '',
      anatomyPart: cue.part,
    },
    cue,
  }
}
