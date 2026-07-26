import type {ResponsiveValue, Viewport} from './types'

type ResponsiveUtilityClasses = Record<Viewport, string>

/**
 * Every responsive utility used by the local components is written explicitly
 * so Tailwind can discover the regular and wide variants at build time.
 */
export const responsiveUtilityClasses = {
  block: {narrow: 'block', regular: 'md:block', wide: '2xl:block'},
  flex: {narrow: 'flex', regular: 'md:flex', wide: '2xl:flex'},
  hidden: {narrow: 'hidden', regular: 'md:hidden', wide: '2xl:hidden'},
  'inline-flex': {narrow: 'inline-flex', regular: 'md:inline-flex', wide: '2xl:inline-flex'},
  'flex-row': {narrow: 'flex-row', regular: 'md:flex-row', wide: '2xl:flex-row'},
  'flex-col': {narrow: 'flex-col', regular: 'md:flex-col', wide: '2xl:flex-col'},
  'flex-wrap': {narrow: 'flex-wrap', regular: 'md:flex-wrap', wide: '2xl:flex-wrap'},
  'flex-nowrap': {narrow: 'flex-nowrap', regular: 'md:flex-nowrap', wide: '2xl:flex-nowrap'},
  'items-stretch': {narrow: 'items-stretch', regular: 'md:items-stretch', wide: '2xl:items-stretch'},
  'items-start': {narrow: 'items-start', regular: 'md:items-start', wide: '2xl:items-start'},
  'items-center': {narrow: 'items-center', regular: 'md:items-center', wide: '2xl:items-center'},
  'items-end': {narrow: 'items-end', regular: 'md:items-end', wide: '2xl:items-end'},
  'items-baseline': {narrow: 'items-baseline', regular: 'md:items-baseline', wide: '2xl:items-baseline'},
  'justify-start': {narrow: 'justify-start', regular: 'md:justify-start', wide: '2xl:justify-start'},
  'justify-center': {narrow: 'justify-center', regular: 'md:justify-center', wide: '2xl:justify-center'},
  'justify-end': {narrow: 'justify-end', regular: 'md:justify-end', wide: '2xl:justify-end'},
  'justify-between': {narrow: 'justify-between', regular: 'md:justify-between', wide: '2xl:justify-between'},
  'justify-evenly': {narrow: 'justify-evenly', regular: 'md:justify-evenly', wide: '2xl:justify-evenly'},
  'gap-0': {narrow: 'gap-0', regular: 'md:gap-0', wide: '2xl:gap-0'},
  'gap-1': {narrow: 'gap-1', regular: 'md:gap-1', wide: '2xl:gap-1'},
  'gap-2': {narrow: 'gap-2', regular: 'md:gap-2', wide: '2xl:gap-2'},
  'gap-3': {narrow: 'gap-3', regular: 'md:gap-3', wide: '2xl:gap-3'},
  'gap-4': {narrow: 'gap-4', regular: 'md:gap-4', wide: '2xl:gap-4'},
  'gap-6': {narrow: 'gap-6', regular: 'md:gap-6', wide: '2xl:gap-6'},
  'p-0': {narrow: 'p-0', regular: 'md:p-0', wide: '2xl:p-0'},
  'p-1': {narrow: 'p-1', regular: 'md:p-1', wide: '2xl:p-1'},
  'p-2': {narrow: 'p-2', regular: 'md:p-2', wide: '2xl:p-2'},
  'p-3': {narrow: 'p-3', regular: 'md:p-3', wide: '2xl:p-3'},
  'p-4': {narrow: 'p-4', regular: 'md:p-4', wide: '2xl:p-4'},
  'p-6': {narrow: 'p-6', regular: 'md:p-6', wide: '2xl:p-6'},
  'px-0': {narrow: 'px-0', regular: 'md:px-0', wide: '2xl:px-0'},
  'px-1': {narrow: 'px-1', regular: 'md:px-1', wide: '2xl:px-1'},
  'px-2': {narrow: 'px-2', regular: 'md:px-2', wide: '2xl:px-2'},
  'px-3': {narrow: 'px-3', regular: 'md:px-3', wide: '2xl:px-3'},
  'px-4': {narrow: 'px-4', regular: 'md:px-4', wide: '2xl:px-4'},
  'px-6': {narrow: 'px-6', regular: 'md:px-6', wide: '2xl:px-6'},
  'py-0': {narrow: 'py-0', regular: 'md:py-0', wide: '2xl:py-0'},
  'py-1': {narrow: 'py-1', regular: 'md:py-1', wide: '2xl:py-1'},
  'py-2': {narrow: 'py-2', regular: 'md:py-2', wide: '2xl:py-2'},
  'py-3': {narrow: 'py-3', regular: 'md:py-3', wide: '2xl:py-3'},
  'py-4': {narrow: 'py-4', regular: 'md:py-4', wide: '2xl:py-4'},
  'py-6': {narrow: 'py-6', regular: 'md:py-6', wide: '2xl:py-6'},
  'mr-0': {narrow: 'mr-0', regular: 'md:mr-0', wide: '2xl:mr-0'},
  'mr-1': {narrow: 'mr-1', regular: 'md:mr-1', wide: '2xl:mr-1'},
  grow: {narrow: 'grow', regular: 'md:grow', wide: '2xl:grow'},
  'grow-0': {narrow: 'grow-0', regular: 'md:grow-0', wide: '2xl:grow-0'},
  shrink: {narrow: 'shrink', regular: 'md:shrink', wide: '2xl:shrink'},
  'shrink-0': {narrow: 'shrink-0', regular: 'md:shrink-0', wide: '2xl:shrink-0'},
  'h-px': {narrow: 'h-px', regular: 'md:h-px', wide: '2xl:h-px'},
  'h-2': {narrow: 'h-2', regular: 'md:h-2', wide: '2xl:h-2'},
  'border-y': {narrow: 'border-y', regular: 'md:border-y', wide: '2xl:border-y'},
  'border-default': {narrow: 'border-default', regular: 'md:border-default', wide: '2xl:border-default'},
  'bg-default': {narrow: 'bg-default', regular: 'md:bg-default', wide: '2xl:bg-default'},
  'bg-inset': {narrow: 'bg-inset', regular: 'md:bg-inset', wide: '2xl:bg-inset'},
  'text-title-medium': {
    narrow: 'text-title-medium',
    regular: 'md:text-title-medium',
    wide: '2xl:text-title-medium',
  },
  'text-title-large': {narrow: 'text-title-large', regular: 'md:text-title-large', wide: '2xl:text-title-large'},
  'font-normal': {narrow: 'font-normal', regular: 'md:font-normal', wide: '2xl:font-normal'},
  'font-semibold': {narrow: 'font-semibold', regular: 'md:font-semibold', wide: '2xl:font-semibold'},
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
 */
export function responsiveClasses<T extends string | boolean>(
  value: ResponsiveValue<T> | undefined,
  classes: Record<string, string>,
  fallback?: ResponsiveValue<T>,
): string | Array<string | undefined> | undefined {
  if (!isResponsiveObject(value) && !isResponsiveObject(fallback)) {
    const resolved = valueAt(value, 'narrow', fallback)
    return resolved === undefined ? undefined : classes[String(resolved)]
  }

  return (Object.keys(responsiveUtilityClasses.block) as Viewport[]).map(viewport => {
    const resolved = valueAt(value, viewport, fallback)
    return resolved === undefined ? undefined : responsiveClassNames(classes[String(resolved)], viewport)
  })
}
