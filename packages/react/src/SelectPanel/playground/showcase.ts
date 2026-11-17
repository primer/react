import {defaultConfig, type PlaygroundConfig} from './model'
import type {AnatomyPart} from './AnatomyInspector'

export const SHOWCASE_DURATION = 58_000
export const SHOWCASE_COUNTDOWN = 3_000
export const SHOWCASE_THEME_DURATION = 3_000
export const SHOWCASE_THEME_PLAYBACK_DURATION = 1_500
export const SHOWCASE_THEME_FADE_DURATION = 250
export const showcaseAppearanceOrder = [0, 2, 1, 4, 5, 3] as const

export const showcasePlatformFeatures = [
  {
    id: 'dialog',
    label: 'Native dialog',
    title: 'Modality belongs to the browser.',
    description: 'Native focus containment and an inert background. Fewer modal mechanics to recreate.',
    code: 'dialog.showModal()',
    benefit: 'Browser-managed modality',
  },
  {
    id: 'anchors',
    label: 'CSS anchors',
    title: 'Keep placement in CSS.',
    description: 'Attach the picker to its trigger with browser-managed positioning and placement fallbacks.',
    code: 'position-anchor: --reviewers;\ntop: calc(anchor(bottom) + 4px);\nleft: anchor(left);',
    benefit: 'Less JavaScript positioning machinery',
  },
  {
    id: 'popover',
    label: 'Popover',
    title: 'Rise above stacking contexts.',
    description: 'A native top layer for the overlay. Keep the same SelectPanel parts and React-controlled state.',
    code: 'renderAs="popover"\n// Native manual popover',
    benefit: 'Top-layer rendering',
  },
  {
    id: 'invokers',
    label: 'Invokers',
    title: 'Declare the action and its target.',
    description: 'Let a button invoke the native dialog, with a small bridge to React state.',
    code: 'command="show-modal"\ncommandfor="reviewers"',
    benefit: 'Declarative browser commands',
  },
] as const

export const showcaseReviewers = [
  {
    id: 'siddharthkp',
    name: 'siddharthkp',
    description: 'Siddharth Kshetrapal',
    avatarUrl: 'https://github.com/siddharthkp.png',
    group: 'Suggestions',
  },
  {
    id: 'rickyzhangca',
    name: 'rickyzhangca',
    description: 'Ricky Zhang',
    avatarUrl: 'https://avatars.githubusercontent.com/u/16908811?v=4',
    group: 'Suggestions',
  },
  {
    id: 'joshblack',
    name: 'joshblack',
    description: 'Josh Black',
    avatarUrl: 'https://avatars.githubusercontent.com/u/3901764?v=4',
    group: 'Everyone else',
  },
  {
    id: 'TylerJDev',
    name: 'TylerJDev',
    description: 'Tyler Jones',
    avatarUrl: 'https://avatars.githubusercontent.com/u/26746305?v=4',
    group: 'Everyone else',
  },
  {
    id: 'tay1orjones',
    name: 'tay1orjones',
    description: 'Taylor Jones',
    avatarUrl: 'https://avatars.githubusercontent.com/u/3360588?v=4',
    group: 'Everyone else',
  },
  {
    id: 'francinelucca',
    name: 'francinelucca',
    description: 'Marie Lucca',
    avatarUrl: 'https://avatars.githubusercontent.com/u/40550942?v=4',
    group: 'Everyone else',
  },
  {
    id: 'adierkens',
    name: 'adierkens',
    description: 'Adam Dierkens',
    avatarUrl: 'https://avatars.githubusercontent.com/u/13004162?v=4',
    group: 'Everyone else',
  },
] as const

export const showcaseScenes = [
  {
    id: 'familiar',
    start: 0,
    label: 'Start',
    title: 'Start with familiar pieces.',
    description: 'A trigger, an overlay, and a search input. Existing Primer foundations, composed together.',
    parts: ['Trigger', 'Overlay', 'SearchInput'],
  },
  {
    id: 'review',
    start: 6_000,
    label: 'Compose',
    title: 'Choose the parts you need.',
    description: 'Compose a collection, customize its items, and add a footer to review and save.',
    parts: ['List', 'Item', 'Footer'],
  },
  {
    id: 'details',
    start: 12_000,
    label: 'Extend',
    title: 'Give each part a job.',
    description: 'A selection and an independent action can share one row. Inspect without selecting.',
    parts: ['List', 'Item', 'secondaryActions'],
  },
  {
    id: 'customize-intro',
    start: 17_000,
    label: 'Style',
    title: 'More room for your ideas.',
    description: 'Composable parts open up more ways to style SelectPanel and make it your own.',
    parts: ['Composable parts', 'Custom styles', 'Same foundations'],
  },
  {
    id: 'customize',
    start: 20_000,
    label: 'Customize',
    title: 'Same anatomy. Your expression.',
    description: 'Change the skin and choose the parts. Keep the same anchored picker and Primer foundations.',
    parts: ['Content', 'List', 'Footer'],
  },
  {
    id: 'mobile',
    start: 38_000,
    label: 'Adapt',
    title: 'Change the container.',
    description: 'The same search, collection, and footer move into a fullscreen mobile panel.',
    parts: ['Overlay', 'List', 'Footer'],
  },
  {
    id: 'platform',
    start: 43_000,
    label: 'Platform & performance',
    title: 'Platform & performance.',
    description: 'The same composable picker, with opt-in native foundations. Less platform behavior to recreate.',
    parts: ['Native dialog', 'CSS anchors', 'Popover', 'Invokers'],
  },
  {
    id: 'closing',
    start: 55_000,
    label: 'Primer',
    title: 'More composable. Still Primer.',
    description: 'Keep what works. Open up the parts.',
    parts: ['Existing API', 'Composable parts', 'Primer foundations'],
  },
] as const

export interface ShowcaseConfig {
  elapsedMs: number
  playing?: boolean
}

export interface ShowcaseFrame {
  scene: (typeof showcaseScenes)[number]
  config: PlaygroundConfig
  open: boolean
  query: string
  selected: string[]
  committed: string[]
  detailsOpen: boolean
  mobile: boolean
  note: string
  anatomyPart: AnatomyPart | null
  keyCue: {keys: string; label: string} | null
  platformFeature: (typeof showcasePlatformFeatures)[number] | null
  themeTransition: {index: number; elapsedMs: number} | null
}

export function isShowcaseConfig(value: unknown): value is ShowcaseConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    'elapsedMs' in value &&
    typeof value.elapsedMs === 'number' &&
    Number.isFinite(value.elapsedMs) &&
    value.elapsedMs >= 0 &&
    value.elapsedMs <= SHOWCASE_DURATION &&
    (!('playing' in value) || value.playing === undefined || typeof value.playing === 'boolean')
  )
}

export function getShowcaseFrame(elapsedMs: number): ShowcaseFrame {
  if (!isShowcaseConfig({elapsedMs})) {
    throw new RangeError(`Showcase time must be between 0 and ${SHOWCASE_DURATION} milliseconds.`)
  }
  const scene = [...showcaseScenes].reverse().find(candidate => elapsedMs >= candidate.start)!
  const time = elapsedMs - scene.start
  const first = showcaseReviewers[0].id
  const second = showcaseReviewers[1].id
  const frame: ShowcaseFrame = {
    scene,
    config: {...defaultConfig},
    open: false,
    query: '',
    selected: [first],
    committed: [first],
    detailsOpen: false,
    mobile: false,
    note: 'Built with Primer',
    anatomyPart: null,
    keyCue: null,
    platformFeature: null,
    themeTransition: null,
  }
  switch (scene.id) {
    case 'familiar':
      frame.query = time >= 3_200 && time < 5_600 ? second.slice(0, Math.floor((time - 3_200) / 80)) : ''
      frame.selected = time >= 5_400 ? [second] : [first]
      frame.committed = frame.selected
      frame.open = time >= 1_400
      frame.anatomyPart =
        time < 1_400 ? 'Trigger' : time < 3_000 ? 'Overlay' : time < 4_500 ? 'SearchInput' : 'SearchInput.leadingVisual'
      frame.note = time < 4_500 ? 'Real Primer pieces, not a new foundation' : 'Even the leading visual is replaceable'
      frame.keyCue =
        time < 2_000
          ? {keys: 'Enter', label: 'Open the picker'}
          : time >= 3_200 && time < 3_200 + second.length * 80
            ? {keys: second[Math.floor((time - 3_200) / 80)].toUpperCase(), label: 'Search reviewers'}
            : time >= 4_800 && time < 5_300
              ? {keys: 'ArrowDown', label: 'Focus the result'}
              : time >= 5_300 && time < 5_700
                ? {keys: 'Enter', label: 'Select the reviewer'}
                : null
      break
    case 'review':
      frame.config = {...defaultConfig, multiple: true, grouped: true, commitMode: 'submit'}
      frame.selected = time >= 3_500 ? [first, second] : [second]
      frame.committed = time >= 5_500 ? frame.selected : [second]
      frame.open = time < 5_500
      frame.anatomyPart =
        time < 1_500
          ? 'List'
          : time < 3_000
            ? 'Item'
            : time < 4_500
              ? 'Footer'
              : time < 5_500
                ? 'SubmitButton'
                : 'Trigger'
      frame.note =
        time < 3_000
          ? 'A collection built on ActionList'
          : time < 5_500
            ? 'A footer is a composition choice'
            : 'Saved together'
      frame.keyCue =
        time < 1_500
          ? {keys: 'ArrowDown', label: 'Move through the list'}
          : time >= 3_500 && time < 4_000
            ? {keys: 'Space', label: 'Toggle a selection'}
            : time >= 4_000 && time < 5_000
              ? {keys: 'Tab', label: time < 4_500 ? 'Move to Cancel' : 'Move to Save'}
              : time >= 5_000
                ? {keys: 'Enter', label: 'Save the selection'}
                : null
      break
    case 'details':
      frame.config = {...defaultConfig, multiple: true, actions: true}
      frame.selected = [first, second]
      frame.committed = frame.selected
      frame.open = true
      frame.detailsOpen = time >= 3_500
      frame.anatomyPart = time < 1_500 ? 'List' : time < 2_500 ? 'Item' : time < 3_500 ? 'Item.secondaryActions' : null
      frame.note = frame.detailsOpen
        ? 'A standard Primer Dialog, without changing selection'
        : 'One independent row action'
      frame.keyCue =
        time < 1_500
          ? {keys: 'ArrowDown', label: 'Focus the reviewer'}
          : time < 4_000
            ? {keys: 'Mod+Shift+U', label: 'Open the secondary action'}
            : {keys: 'Escape', label: 'Return to the reviewer'}
      break
    case 'customize-intro':
      frame.note = 'Composable parts. More ways to make it yours.'
      break
    case 'customize':
      frame.themeTransition = {
        index: Math.min(showcaseAppearanceOrder.length - 1, Math.floor(time / SHOWCASE_THEME_DURATION)),
        elapsedMs: time % SHOWCASE_THEME_DURATION,
      }
      frame.config = {
        ...defaultConfig,
        multiple: true,
        commitMode: 'submit',
        appearance: showcaseAppearanceOrder[frame.themeTransition.index],
      }
      frame.open = true
      frame.selected = [first, second]
      frame.committed = frame.selected
      frame.note = 'Same foundations, different expression'
      break
    case 'mobile':
      frame.mobile = true
      frame.config = {...defaultConfig, multiple: true, commitMode: 'submit'}
      frame.selected = [first, second]
      frame.committed = frame.selected
      frame.open = time >= 1_500
      frame.anatomyPart = time < 1_500 ? 'Trigger' : time < 2_500 ? 'Overlay' : 'Footer'
      frame.note = frame.open ? 'Same search, collection, and footer. Fullscreen on mobile.' : 'A real 375px viewport.'
      frame.keyCue =
        time < 2_000
          ? {keys: 'Enter', label: 'Open the mobile picker'}
          : time < 4_000
            ? {keys: 'ArrowDown', label: 'The same list navigation'}
            : {keys: 'Escape', label: 'Dismiss the picker'}
      break
    case 'platform':
      frame.platformFeature = showcasePlatformFeatures[Math.floor(time / 3_000)]
      frame.note = 'Opt-in platform experiments. Same composable parts.'
      break
    case 'closing':
      frame.open = false
      frame.note = 'Evolve Primer. Open up the parts.'
      break
  }
  return frame
}
