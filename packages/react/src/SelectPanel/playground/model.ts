import {appearanceStops} from './appearance'

export interface PlaygroundConfig {
  anatomy: boolean
  appearance: number
  search: boolean
  descriptions: boolean
  grouped: boolean
  multiple: boolean
  actions: boolean
  commitMode: 'immediate' | 'submit'
  presentation: 'anchored' | 'modal' | 'inline'
  previewState: 'ready' | 'loading' | 'empty' | 'error'
}

export interface PlaygroundPreset {
  id: string
  name: string
  config: PlaygroundConfig
}

const initialConfig: PlaygroundConfig = {
  anatomy: false,
  appearance: 0,
  search: true,
  descriptions: false,
  grouped: false,
  multiple: false,
  actions: false,
  commitMode: 'immediate',
  presentation: 'anchored',
  previewState: 'ready',
}

export const presets: readonly PlaygroundPreset[] = [
  {
    id: 'repositories',
    name: 'Repositories',
    config: initialConfig,
  },
  {
    id: 'quick-pick',
    name: 'Quick pick',
    config: {...initialConfig, search: false},
  },
  {
    id: 'review',
    name: 'Review & save',
    config: {...initialConfig, multiple: true, grouped: true, commitMode: 'submit'},
  },
  {
    id: 'actions',
    name: 'With actions',
    config: {...initialConfig, multiple: true, actions: true},
  },
  {
    id: 'inline',
    name: 'Inline',
    config: {...initialConfig, presentation: 'inline'},
  },
]

export const defaultConfig = initialConfig

export const repositories = [
  {
    id: 'copilot-tauri-app',
    name: 'copilot-tauri-app',
    language: 'TypeScript',
    description: 'A desktop home for your coding companion.',
    group: 'Applications',
  },
  {
    id: 'reforge',
    name: 'reforge',
    language: 'TypeScript',
    description: 'Tools for building better developer experiences.',
    group: 'Applications',
  },
  {
    id: 'copilot-agent-runtime',
    name: 'copilot-agent-runtime',
    language: 'Rust',
    description: 'The engine behind background coding tasks.',
    group: 'Infrastructure',
  },
]

export function isPlaygroundConfig(value: unknown): value is PlaygroundConfig {
  if (typeof value !== 'object' || value === null) return false
  return (
    'anatomy' in value &&
    typeof value.anatomy === 'boolean' &&
    'appearance' in value &&
    typeof value.appearance === 'number' &&
    Number.isFinite(value.appearance) &&
    value.appearance >= 0 &&
    value.appearance <= appearanceStops.length - 1 &&
    'search' in value &&
    typeof value.search === 'boolean' &&
    'descriptions' in value &&
    typeof value.descriptions === 'boolean' &&
    'grouped' in value &&
    typeof value.grouped === 'boolean' &&
    'multiple' in value &&
    typeof value.multiple === 'boolean' &&
    'actions' in value &&
    typeof value.actions === 'boolean' &&
    'commitMode' in value &&
    (value.commitMode === 'immediate' || value.commitMode === 'submit') &&
    'presentation' in value &&
    (value.presentation === 'anchored' || value.presentation === 'modal' || value.presentation === 'inline') &&
    'previewState' in value &&
    (value.previewState === 'ready' ||
      value.previewState === 'loading' ||
      value.previewState === 'empty' ||
      value.previewState === 'error')
  )
}
