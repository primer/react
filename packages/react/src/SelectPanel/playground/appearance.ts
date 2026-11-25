import type {CSSProperties} from 'react'
import {getContrast} from 'color2k'

export const appearanceStops = [
  {name: 'Primer', description: 'Restrained GitHub neutrals, familiar density, and softly rounded corners.'},
  {
    name: 'Base UI-inspired',
    description: 'An original minimal black-and-white skin inspired by Base UI examples; Base UI is headless.',
  },
  {
    name: 'GitHub App',
    description: 'A compact app-inspired popup with integrated search, subtle elevation, and 13px UI text.',
  },
  {name: 'Windows 98', description: 'Playful square bevels, compact Tahoma, and a classic navy selection.'},
  {name: 'Paper', description: 'Warm ivory surfaces, editorial serif headings, and familiar picker density.'},
  {name: 'Terminal', description: 'A crisp green-on-black terminal with monospace text and square edges.'},
] as const

const primerLengths = {
  'font-size': 14,
  'title-size': 14,
  'meta-size': 12,
  'panel-radius': 8,
  'control-radius': 8,
  'row-radius': 6,
  'border-width': 1,
  'panel-padding': 8,
  'header-padding': 8,
  'row-padding-x': 8,
  'row-padding-y': 6,
  'row-min-height': 32,
  'control-height': 32,
  gap: 8,
  'bevel-width': 0,
  'shadow-x': 0,
  'shadow-y': 8,
  'shadow-blur': 24,
  'shadow-spread': -4,
} as const

type Lengths = {[Key in keyof typeof primerLengths]: number}
type Color = readonly [red: number, green: number, blue: number, alpha: number]

const primerColors = {
  'stage-bg': [246, 248, 250, 1],
  'stage-text': [31, 35, 40, 1],
  'panel-bg': [255, 255, 255, 1],
  text: [31, 35, 40, 1],
  muted: [89, 99, 110, 1],
  disabled: [129, 139, 152, 1],
  border: [209, 217, 224, 1],
  'control-bg': [246, 248, 250, 1],
  'search-bg': [255, 255, 255, 1],
  'hover-bg': [234, 238, 242, 1],
  'selected-bg': [221, 244, 255, 1],
  'selected-text': [31, 35, 40, 1],
  focus: [9, 105, 218, 1],
  'header-bg': [255, 255, 255, 1],
  'header-text': [31, 35, 40, 1],
  'action-bg': [31, 136, 61, 1],
  'action-text': [255, 255, 255, 1],
  'bevel-light': [255, 255, 255, 1],
  'bevel-dark': [128, 128, 128, 1],
  'shadow-color': [31, 35, 40, 0.2],
} as const satisfies Record<string, Color>

type Colors = {[Key in keyof typeof primerColors]: Color}

interface Appearance {
  readonly className?: 'GitHubApp' | 'Terminal' | 'Paper'
  readonly lengths: Lengths
  readonly colors: Colors
  readonly fontFamily: string
  readonly lineHeight: number
  readonly fontWeight: number
}

const systemFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

const appearances: readonly Appearance[] = [
  {
    lengths: primerLengths,
    colors: primerColors,
    fontFamily: systemFont,
    lineHeight: 1.43,
    fontWeight: 400,
  },
  {
    lengths: {
      ...primerLengths,
      'row-radius': 5,
      'panel-padding': 6,
      'shadow-y': 6,
      'shadow-blur': 20,
    },
    colors: {
      ...primerColors,
      'stage-bg': [247, 247, 247, 1],
      'stage-text': [23, 23, 23, 1],
      text: [23, 23, 23, 1],
      muted: [102, 102, 102, 1],
      disabled: [140, 140, 140, 1],
      border: [224, 224, 224, 1],
      'control-bg': [255, 255, 255, 1],
      'hover-bg': [245, 245, 245, 1],
      'selected-bg': [235, 235, 235, 1],
      'selected-text': [23, 23, 23, 1],
      focus: [23, 23, 23, 1],
      'header-text': [23, 23, 23, 1],
      'action-bg': [23, 23, 23, 1],
      'shadow-color': [0, 0, 0, 0.12],
    },
    fontFamily: systemFont,
    lineHeight: 1.5,
    fontWeight: 400,
  },
  {
    className: 'GitHubApp',
    lengths: {
      ...primerLengths,
      'font-size': 13,
      'title-size': 12,
      'panel-radius': 12,
      'control-radius': 8,
      'row-radius': 8,
      'panel-padding': 0,
      'row-padding-y': 4,
      'row-min-height': 28,
      'control-height': 32,
      'shadow-y': 6,
      'shadow-blur': 18,
      'shadow-spread': 0,
    },
    colors: {
      ...primerColors,
      'stage-bg': [245, 245, 247, 1],
      'stage-text': [32, 32, 35, 1],
      text: [32, 32, 35, 1],
      muted: [105, 105, 112, 1],
      disabled: [145, 145, 150, 1],
      border: [225, 225, 229, 1],
      'control-bg': [232, 232, 235, 1],
      'hover-bg': [246, 246, 248, 1],
      'selected-bg': [238, 238, 240, 1],
      'selected-text': [32, 32, 35, 1],
      focus: [0, 112, 243, 1],
      'header-text': [32, 32, 35, 1],
      'action-bg': [32, 32, 35, 1],
      'shadow-color': [20, 20, 30, 0.12],
    },
    fontFamily: systemFont,
    lineHeight: 20 / 13,
    fontWeight: 400,
  },
  {
    lengths: {
      ...primerLengths,
      'font-size': 12,
      'title-size': 12,
      'meta-size': 11,
      'panel-radius': 0,
      'control-radius': 0,
      'row-radius': 0,
      'border-width': 2,
      'panel-padding': 4,
      'header-padding': 4,
      'row-padding-x': 6,
      'row-padding-y': 4,
      'row-min-height': 26,
      'control-height': 28,
      gap: 4,
      'bevel-width': 1,
      'shadow-x': 3,
      'shadow-y': 3,
      'shadow-blur': 0,
      'shadow-spread': 0,
    },
    colors: {
      ...primerColors,
      'stage-bg': [0, 128, 128, 1],
      'stage-text': [255, 255, 255, 1],
      'panel-bg': [192, 192, 192, 1],
      text: [0, 0, 0, 1],
      muted: [64, 64, 64, 1],
      disabled: [112, 112, 112, 1],
      border: [128, 128, 128, 1],
      'control-bg': [192, 192, 192, 1],
      'hover-bg': [223, 223, 223, 1],
      'selected-bg': [0, 0, 128, 1],
      'selected-text': [255, 255, 255, 1],
      focus: [0, 0, 128, 1],
      'header-bg': [0, 0, 128, 1],
      'header-text': [255, 255, 255, 1],
      'action-bg': [192, 192, 192, 1],
      'action-text': [0, 0, 0, 1],
      'shadow-color': [0, 0, 0, 0.45],
    },
    fontFamily: 'Tahoma, "MS Sans Serif", Arial, sans-serif',
    lineHeight: 1.25,
    fontWeight: 400,
  },
  {
    className: 'Paper',
    lengths: {
      ...primerLengths,
      'panel-radius': 3,
      'control-radius': 4,
      'row-radius': 3,
      'shadow-blur': 18,
      'shadow-spread': -6,
    },
    colors: {
      ...primerColors,
      'stage-bg': [239, 232, 218, 1],
      'stage-text': [53, 45, 36, 1],
      'panel-bg': [255, 252, 244, 1],
      text: [53, 45, 36, 1],
      muted: [105, 92, 74, 1],
      border: [181, 164, 139, 1],
      'control-bg': [255, 252, 244, 1],
      'search-bg': [255, 252, 244, 1],
      'hover-bg': [255, 252, 244, 1],
      'selected-bg': [234, 219, 187, 1],
      'selected-text': [58, 45, 27, 1],
      focus: [122, 69, 34, 1],
      'header-bg': [255, 252, 244, 1],
      'header-text': [53, 45, 36, 1],
      'action-bg': [83, 60, 37, 1],
      'action-text': [255, 252, 244, 1],
      'shadow-color': [80, 57, 28, 0.18],
    },
    fontFamily: systemFont,
    lineHeight: 1.5,
    fontWeight: 400,
  },
  {
    className: 'Terminal',
    lengths: {
      ...primerLengths,
      'font-size': 12,
      'title-size': 12,
      'panel-radius': 0,
      'control-radius': 0,
      'row-radius': 0,
      'panel-padding': 6,
      'header-padding': 6,
      'row-padding-x': 6,
      'row-padding-y': 6,
      'row-min-height': 30,
      'control-height': 32,
      gap: 4,
      'shadow-y': 0,
      'shadow-blur': 0,
      'shadow-spread': 0,
    },
    colors: {
      ...primerColors,
      'stage-bg': [11, 17, 14, 1],
      'stage-text': [195, 244, 204, 1],
      'panel-bg': [18, 27, 22, 1],
      text: [195, 244, 204, 1],
      muted: [142, 188, 153, 1],
      disabled: [99, 123, 105, 1],
      border: [92, 135, 102, 1],
      'control-bg': [18, 27, 22, 1],
      'search-bg': [18, 27, 22, 1],
      'hover-bg': [18, 27, 22, 1],
      'selected-bg': [138, 235, 154, 1],
      'selected-text': [10, 28, 15, 1],
      focus: [163, 255, 177, 1],
      'header-bg': [20, 34, 25, 1],
      'header-text': [195, 244, 204, 1],
      'action-bg': [138, 235, 154, 1],
      'action-text': [10, 28, 15, 1],
      'shadow-color': [0, 0, 0, 0],
    },
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
    lineHeight: 1.5,
    fontWeight: 400,
  },
]

export type AppearanceStyle = CSSProperties & {[Key in keyof Lengths as `--playground-${Key}`]: `${number}px`} & {
  [Key in keyof Colors as `--playground-${Key}`]: string
} & {
  '--playground-font-family': string
  '--playground-line-height': number
  '--playground-font-weight': number
}

interface AppearanceResult {
  className?: Appearance['className']
  style: AppearanceStyle
  label: string
}

const interpolate = (start: number, end: number, fraction: number) =>
  Number((start + (end - start) * fraction).toFixed(4))

function getReadableText(foreground: string, backgrounds: readonly string[]): string {
  // color2k only parses integer RGB. Checking both byte-rounding bounds keeps
  // fractional CSS interpolation safe without quantizing the rendered colors.
  const bounds = (color: string) => {
    const channels = color.slice(5, -1).split(',').slice(0, 3).map(Number)
    return [`rgb(${channels.map(Math.floor).join(', ')})`, `rgb(${channels.map(Math.ceil).join(', ')})`]
  }
  const backgroundBounds = backgrounds.flatMap(bounds)
  const contrast = (color: string) =>
    Math.min(...bounds(color).flatMap(bound => backgroundBounds.map(background => getContrast(bound, background))))
  if (contrast(foreground) >= 4.5) return foreground

  const black = 'rgba(0, 0, 0, 1)'
  const white = 'rgba(255, 255, 255, 1)'
  return contrast(black) >= contrast(white) ? black : white
}

/**
 * Returns a fresh, serializable skin for the stage and its portaled overlay.
 * Dimensions and sRGB channels interpolate continuously; font stacks switch halfway.
 * Text deliberately switches to black or white only when its interpolated color
 * fails 4.5:1 contrast. Animating that discrete correction would make it unreadable.
 */
export function getAppearance(position: number): AppearanceResult {
  if (!Number.isFinite(position) || position < 0 || position > appearanceStops.length - 1) {
    throw new RangeError(`Appearance position must be a finite number between 0 and ${appearanceStops.length - 1}.`)
  }

  const index = Math.floor(position)
  const fraction = position - index
  const nextIndex = Math.min(index + 1, appearances.length - 1)
  const start = appearances[index]
  const end = appearances[nextIndex]
  const lengths = Object.fromEntries(
    (Object.keys(primerLengths) as Array<keyof Lengths>).map(key => [
      `--playground-${key}`,
      `${interpolate(start.lengths[key], end.lengths[key], fraction)}px`,
    ]),
  )
  const colors = Object.fromEntries(
    (Object.keys(primerColors) as Array<keyof Colors>).map(key => {
      const channels = start.colors[key].map((channel, channelIndex) =>
        interpolate(channel, end.colors[key][channelIndex], fraction),
      )
      return [`--playground-${key}`, `rgba(${channels.join(', ')})`]
    }),
  )
  const ordinarySurfaces = [
    colors['--playground-panel-bg'],
    colors['--playground-control-bg'],
    colors['--playground-search-bg'],
    colors['--playground-hover-bg'],
  ]
  const style = {
    ...lengths,
    ...colors,
    '--playground-text': getReadableText(colors['--playground-text'], ordinarySurfaces),
    '--playground-muted': getReadableText(colors['--playground-muted'], ordinarySurfaces),
    '--playground-stage-text': getReadableText(colors['--playground-stage-text'], [colors['--playground-stage-bg']]),
    '--playground-selected-text': getReadableText(colors['--playground-selected-text'], [
      colors['--playground-selected-bg'],
    ]),
    '--playground-header-text': getReadableText(colors['--playground-header-text'], [colors['--playground-header-bg']]),
    '--playground-action-text': getReadableText(colors['--playground-action-text'], [colors['--playground-action-bg']]),
    '--playground-font-family': fraction < 0.5 ? start.fontFamily : end.fontFamily,
    '--playground-line-height': interpolate(start.lineHeight, end.lineHeight, fraction),
    '--playground-font-weight': interpolate(start.fontWeight, end.fontWeight, fraction),
  } as AppearanceStyle
  const percentage = interpolate(0, 100, fraction)

  return {
    className: fraction === 0 ? start.className : undefined,
    style,
    label:
      fraction === 0
        ? appearanceStops[index].name
        : `${appearanceStops[index].name} ${interpolate(100, 0, fraction)}% / ${appearanceStops[nextIndex].name} ${percentage}%`,
  }
}
