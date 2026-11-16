import type {ResponsiveValue, Viewport} from './types'

type ResponsiveUtilityClasses = Record<Viewport, string>

/**
 * Every responsive utility used by the local components is written explicitly
 * so Tailwind can discover the regular and wide variants at build time.
 * Keys are unprefixed lookup names; values are the package-prefixed utilities.
 */
export const responsiveUtilityClasses = {
  block: {narrow: 'primer:block', regular: 'primer:md:block', wide: 'primer:2xl:block'},
  flex: {narrow: 'primer:flex', regular: 'primer:md:flex', wide: 'primer:2xl:flex'},
  hidden: {narrow: 'primer:hidden', regular: 'primer:md:hidden', wide: 'primer:2xl:hidden'},
  'inline-flex': {narrow: 'primer:inline-flex', regular: 'primer:md:inline-flex', wide: 'primer:2xl:inline-flex'},
  'flex-row': {narrow: 'primer:flex-row', regular: 'primer:md:flex-row', wide: 'primer:2xl:flex-row'},
  'flex-col': {narrow: 'primer:flex-col', regular: 'primer:md:flex-col', wide: 'primer:2xl:flex-col'},
  'flex-wrap': {narrow: 'primer:flex-wrap', regular: 'primer:md:flex-wrap', wide: 'primer:2xl:flex-wrap'},
  'flex-nowrap': {narrow: 'primer:flex-nowrap', regular: 'primer:md:flex-nowrap', wide: 'primer:2xl:flex-nowrap'},
  'items-stretch': {
    narrow: 'primer:items-stretch',
    regular: 'primer:md:items-stretch',
    wide: 'primer:2xl:items-stretch',
  },
  'items-start': {narrow: 'primer:items-start', regular: 'primer:md:items-start', wide: 'primer:2xl:items-start'},
  'items-center': {narrow: 'primer:items-center', regular: 'primer:md:items-center', wide: 'primer:2xl:items-center'},
  'items-end': {narrow: 'primer:items-end', regular: 'primer:md:items-end', wide: 'primer:2xl:items-end'},
  'items-baseline': {
    narrow: 'primer:items-baseline',
    regular: 'primer:md:items-baseline',
    wide: 'primer:2xl:items-baseline',
  },
  'justify-start': {
    narrow: 'primer:justify-start',
    regular: 'primer:md:justify-start',
    wide: 'primer:2xl:justify-start',
  },
  'justify-center': {
    narrow: 'primer:justify-center',
    regular: 'primer:md:justify-center',
    wide: 'primer:2xl:justify-center',
  },
  'justify-end': {narrow: 'primer:justify-end', regular: 'primer:md:justify-end', wide: 'primer:2xl:justify-end'},
  'justify-between': {
    narrow: 'primer:justify-between',
    regular: 'primer:md:justify-between',
    wide: 'primer:2xl:justify-between',
  },
  'justify-evenly': {
    narrow: 'primer:justify-evenly',
    regular: 'primer:md:justify-evenly',
    wide: 'primer:2xl:justify-evenly',
  },
  'gap-0': {narrow: 'primer:gap-0', regular: 'primer:md:gap-0', wide: 'primer:2xl:gap-0'},
  'gap-1': {narrow: 'primer:gap-1', regular: 'primer:md:gap-1', wide: 'primer:2xl:gap-1'},
  'gap-2': {narrow: 'primer:gap-2', regular: 'primer:md:gap-2', wide: 'primer:2xl:gap-2'},
  'gap-3': {narrow: 'primer:gap-3', regular: 'primer:md:gap-3', wide: 'primer:2xl:gap-3'},
  'gap-4': {narrow: 'primer:gap-4', regular: 'primer:md:gap-4', wide: 'primer:2xl:gap-4'},
  'gap-6': {narrow: 'primer:gap-6', regular: 'primer:md:gap-6', wide: 'primer:2xl:gap-6'},
  'p-0': {narrow: 'primer:p-0', regular: 'primer:md:p-0', wide: 'primer:2xl:p-0'},
  'p-1': {narrow: 'primer:p-1', regular: 'primer:md:p-1', wide: 'primer:2xl:p-1'},
  'p-2': {narrow: 'primer:p-2', regular: 'primer:md:p-2', wide: 'primer:2xl:p-2'},
  'p-3': {narrow: 'primer:p-3', regular: 'primer:md:p-3', wide: 'primer:2xl:p-3'},
  'p-4': {narrow: 'primer:p-4', regular: 'primer:md:p-4', wide: 'primer:2xl:p-4'},
  'p-6': {narrow: 'primer:p-6', regular: 'primer:md:p-6', wide: 'primer:2xl:p-6'},
  'px-0': {narrow: 'primer:px-0', regular: 'primer:md:px-0', wide: 'primer:2xl:px-0'},
  'px-1': {narrow: 'primer:px-1', regular: 'primer:md:px-1', wide: 'primer:2xl:px-1'},
  'px-2': {narrow: 'primer:px-2', regular: 'primer:md:px-2', wide: 'primer:2xl:px-2'},
  'px-3': {narrow: 'primer:px-3', regular: 'primer:md:px-3', wide: 'primer:2xl:px-3'},
  'px-4': {narrow: 'primer:px-4', regular: 'primer:md:px-4', wide: 'primer:2xl:px-4'},
  'px-6': {narrow: 'primer:px-6', regular: 'primer:md:px-6', wide: 'primer:2xl:px-6'},
  'py-0': {narrow: 'primer:py-0', regular: 'primer:md:py-0', wide: 'primer:2xl:py-0'},
  'py-1': {narrow: 'primer:py-1', regular: 'primer:md:py-1', wide: 'primer:2xl:py-1'},
  'py-2': {narrow: 'primer:py-2', regular: 'primer:md:py-2', wide: 'primer:2xl:py-2'},
  'py-3': {narrow: 'primer:py-3', regular: 'primer:md:py-3', wide: 'primer:2xl:py-3'},
  'py-4': {narrow: 'primer:py-4', regular: 'primer:md:py-4', wide: 'primer:2xl:py-4'},
  'py-6': {narrow: 'primer:py-6', regular: 'primer:md:py-6', wide: 'primer:2xl:py-6'},
  'mr-0': {narrow: 'primer:mr-0', regular: 'primer:md:mr-0', wide: 'primer:2xl:mr-0'},
  'mr-1': {narrow: 'primer:mr-1', regular: 'primer:md:mr-1', wide: 'primer:2xl:mr-1'},
  grow: {narrow: 'primer:grow', regular: 'primer:md:grow', wide: 'primer:2xl:grow'},
  'grow-0': {narrow: 'primer:grow-0', regular: 'primer:md:grow-0', wide: 'primer:2xl:grow-0'},
  shrink: {narrow: 'primer:shrink', regular: 'primer:md:shrink', wide: 'primer:2xl:shrink'},
  'shrink-0': {narrow: 'primer:shrink-0', regular: 'primer:md:shrink-0', wide: 'primer:2xl:shrink-0'},
  'h-px': {narrow: 'primer:h-px', regular: 'primer:md:h-px', wide: 'primer:2xl:h-px'},
  'h-2': {narrow: 'primer:h-2', regular: 'primer:md:h-2', wide: 'primer:2xl:h-2'},
  'border-y': {narrow: 'primer:border-y', regular: 'primer:md:border-y', wide: 'primer:2xl:border-y'},
  'border-default': {
    narrow: 'primer:border-default',
    regular: 'primer:md:border-default',
    wide: 'primer:2xl:border-default',
  },
  'bg-default': {narrow: 'primer:bg-default', regular: 'primer:md:bg-default', wide: 'primer:2xl:bg-default'},
  'bg-inset': {narrow: 'primer:bg-inset', regular: 'primer:md:bg-inset', wide: 'primer:2xl:bg-inset'},
  'text-title-medium': {
    narrow: 'primer:text-title-medium',
    regular: 'primer:md:text-title-medium',
    wide: 'primer:2xl:text-title-medium',
  },
  'text-title-large': {
    narrow: 'primer:text-title-large',
    regular: 'primer:md:text-title-large',
    wide: 'primer:2xl:text-title-large',
  },
  'font-normal': {narrow: 'primer:font-normal', regular: 'primer:md:font-normal', wide: 'primer:2xl:font-normal'},
  'font-semibold': {
    narrow: 'primer:font-semibold',
    regular: 'primer:md:font-semibold',
    wide: 'primer:2xl:font-semibold',
  },
} satisfies Record<string, ResponsiveUtilityClasses>

const responsiveUtilityClassesByName: Partial<Record<string, ResponsiveUtilityClasses>> = responsiveUtilityClasses

function responsiveClassName(className: string, viewport: Viewport): string {
  const classes = responsiveUtilityClassesByName[className]
  if (!classes) {
    throw new Error(`Missing static responsive Tailwind class map for "${className}"`)
  }
  return classes[viewport]
}

function responsiveClassNames(classNames: string, viewport: Viewport): string {
  return classNames
    .split(' ')
    .filter(Boolean)
    .map(className => responsiveClassName(className, viewport))
    .join(' ')
}

function isResponsiveObject<T>(value: ResponsiveValue<T> | undefined): value is Partial<Record<Viewport, T>> {
  return typeof value === 'object' && value !== null
}

function valueAt<T>(
  value: ResponsiveValue<T> | undefined,
  viewport: Viewport,
  fallback: ResponsiveValue<T> | undefined,
): T | undefined {
  const fallbackValue = isResponsiveObject(fallback) ? fallback[viewport] : fallback
  if (value === undefined) return fallbackValue
  return isResponsiveObject(value) ? (value[viewport] ?? fallbackValue) : value
}

/**
 * Maps Primer's three viewport ranges to Tailwind's mobile-first utilities.
 * An omitted range uses the component's default rather than inheriting a neighbouring range.
 * `classes` values are space-separated lookup names from `responsiveUtilityClasses`.
 */
export function responsiveClasses<T extends string | boolean>(
  value: ResponsiveValue<T> | undefined,
  classes: Record<string, string>,
  fallback?: ResponsiveValue<T>,
): string | Array<string | undefined> | undefined {
  if (!isResponsiveObject(value) && !isResponsiveObject(fallback)) {
    const resolved = valueAt(value, 'narrow', fallback)
    return resolved === undefined ? undefined : responsiveClassNames(classes[String(resolved)], 'narrow')
  }

  return (Object.keys(responsiveUtilityClasses.block) as Viewport[]).map(viewport => {
    const resolved = valueAt(value, viewport, fallback)
    return resolved === undefined ? undefined : responsiveClassNames(classes[String(resolved)], viewport)
  })
}
