import {Duration, elapsedTime, getRelativeTimeUnit, isDuration, roundToSingleUnit, type Unit} from './duration'

export type Format = 'auto' | 'micro' | 'elapsed' | 'duration' | 'relative' | 'datetime'
export type FormatStyle = 'long' | 'short' | 'narrow'
export type Tense = 'auto' | 'past' | 'future'

type NumericDatePart = '' | 'numeric' | '2-digit'

export interface RelativeTimeFormatOptions {
  day?: NumericDatePart
  format?: Format
  formatStyle?: FormatStyle
  hour?: NumericDatePart
  locale?: string
  minute?: NumericDatePart
  month?: NumericDatePart | 'short' | 'long' | 'narrow'
  precision?: Unit
  prefix?: string
  second?: NumericDatePart
  tense?: Tense
  threshold?: string
  timeZone?: string
  timeZoneName?: '' | 'long' | 'short' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric'
  weekday?: '' | 'short' | 'long' | 'narrow'
  year?: NumericDatePart
}

export interface FormattedRelativeTime {
  text: string
  title: string
  resolvedFormat: 'datetime' | 'duration' | 'relative'
}

const emptyDuration = new Duration()
const microEmptyDuration = new Duration(0, 0, 0, 0, 0, 1)

function isFormat(value: string | undefined): value is Format {
  return (
    value === 'auto' ||
    value === 'micro' ||
    value === 'elapsed' ||
    value === 'duration' ||
    value === 'relative' ||
    value === 'datetime'
  )
}

function isFormatStyle(value: string | undefined): value is FormatStyle {
  return value === 'long' || value === 'short' || value === 'narrow'
}

function isTense(value: string | undefined): value is Tense {
  return value === 'auto' || value === 'past' || value === 'future'
}

function datePart(value: NumericDatePart | undefined) {
  return value === 'numeric' || value === '2-digit' ? value : undefined
}

function dateTimeOptions(date: Date, now: number, options: RelativeTimeFormatOptions): Intl.DateTimeFormatOptions {
  const format = getFormat(options)
  const formatStyle = getFormatStyle(options, format)
  const currentDate = new Date(now)
  return {
    second: datePart(options.second),
    minute: datePart(options.minute),
    hour: datePart(options.hour),
    weekday:
      options.weekday === 'long' || options.weekday === 'short' || options.weekday === 'narrow'
        ? options.weekday
        : format === 'datetime' && options.weekday !== ''
          ? formatStyle
          : undefined,
    day: options.day === undefined ? 'numeric' : datePart(options.day),
    month:
      options.month === ''
        ? undefined
        : options.month === 'numeric' ||
            options.month === '2-digit' ||
            options.month === 'short' ||
            options.month === 'long' ||
            options.month === 'narrow'
          ? options.month
          : format === 'datetime'
            ? formatStyle
            : 'short',
    year:
      options.year === undefined && currentDate.getUTCFullYear() !== date.getUTCFullYear()
        ? 'numeric'
        : datePart(options.year),
    timeZoneName: options.timeZoneName || undefined,
    timeZone: options.timeZone,
  }
}

function getFormat(options: RelativeTimeFormatOptions) {
  return isFormat(options.format) ? options.format : 'auto'
}

function getFormatStyle(options: RelativeTimeFormatOptions, format = getFormat(options)): FormatStyle {
  if (isFormatStyle(options.formatStyle)) return options.formatStyle
  return format === 'elapsed' || format === 'micro' ? 'narrow' : format === 'datetime' ? 'short' : 'long'
}

function getTense(options: RelativeTimeFormatOptions) {
  return isTense(options.tense) ? options.tense : 'auto'
}

function getPrecision(options: RelativeTimeFormatOptions, format = getFormat(options)): Unit {
  return options.precision && ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'].includes(options.precision)
    ? options.precision
    : format === 'micro'
      ? 'minute'
      : 'second'
}

function getThreshold(options: RelativeTimeFormatOptions) {
  return options.threshold && isDuration(options.threshold) ? options.threshold : 'P30D'
}

function getExplicitThreshold(options: RelativeTimeFormatOptions) {
  return options.threshold && isDuration(options.threshold) ? options.threshold : null
}

function getMicroDuration(duration: Duration, tense: Tense) {
  const rounded = roundToSingleUnit(duration)
  if (
    rounded.months === 0 &&
    ((tense === 'past' && rounded.sign !== -1) || (tense === 'future' && rounded.sign !== 1))
  ) {
    return microEmptyDuration
  }
  return rounded
}

function formatDuration(
  duration: Duration,
  locale: string | undefined,
  style: FormatStyle,
  display?: `${Unit}sDisplay`,
) {
  const parts: string[] = []
  const durationParts: Array<[keyof Duration, Intl.NumberFormatOptions, string]> = [
    ['years', {style: 'unit', unit: 'year', unitDisplay: style}, 'year'],
    ['months', {style: 'unit', unit: 'month', unitDisplay: style}, 'month'],
    ['weeks', {style: 'unit', unit: 'week', unitDisplay: style}, 'week'],
    ['days', {style: 'unit', unit: 'day', unitDisplay: style}, 'day'],
    ['hours', {style: 'unit', unit: 'hour', unitDisplay: style}, 'hour'],
    ['minutes', {style: 'unit', unit: 'minute', unitDisplay: style}, 'minute'],
    ['seconds', {style: 'unit', unit: 'second', unitDisplay: style}, 'second'],
    ['milliseconds', {style: 'unit', unit: 'millisecond', unitDisplay: style}, 'millisecond'],
  ]

  for (const [property, numberOptions, unit] of durationParts) {
    const value = duration[property] as number
    if (!value && display !== `${unit}sDisplay`) continue
    let text = new Intl.NumberFormat(locale, numberOptions).format(value)
    if (unit === 'month' && style === 'narrow') {
      text = text.replace(/(\d+)m$/, '$1mo')
    }
    parts.push(text)
  }

  return new Intl.ListFormat(locale, {type: 'unit', style}).format(parts)
}

function resolveFormat(
  duration: Duration,
  thresholdDuration: Duration,
  options: RelativeTimeFormatOptions,
): FormattedRelativeTime['resolvedFormat'] {
  const format = getFormat(options)
  if (format === 'datetime') return 'datetime'
  if (format === 'duration' || format === 'elapsed') return 'duration'
  if (format === 'micro') {
    const threshold = getExplicitThreshold(options)
    return threshold && Duration.compare(thresholdDuration, threshold) === -1 ? 'datetime' : 'duration'
  }
  if (getTense(options) !== 'auto') return 'relative'
  return Duration.compare(duration, getThreshold(options)) === 1 ? 'relative' : 'datetime'
}

export function getFormattedTitle(date: Date, options: Pick<RelativeTimeFormatOptions, 'locale' | 'timeZone'> = {}) {
  return new Intl.DateTimeFormat(options.locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: options.timeZone,
  }).format(date)
}

export function getDateTimeText(date: Date, options: RelativeTimeFormatOptions, now: number) {
  const prefix = options.prefix ?? (getFormat(options) === 'datetime' ? '' : 'on')
  return `${prefix} ${new Intl.DateTimeFormat(options.locale, dateTimeOptions(date, now, options)).format(date)}`.trim()
}

export function formatRelativeTime(date: Date, now: number, options: RelativeTimeFormatOptions): FormattedRelativeTime {
  const format = getFormat(options)
  const precision = getPrecision(options, format)
  const locale = options.locale
  const duration = elapsedTime(date, precision, now)
  const resolvedFormat = resolveFormat(duration, elapsedTime(date, 'millisecond', now), options)
  const title = getFormattedTitle(date, options)

  if (resolvedFormat === 'datetime') return {text: getDateTimeText(date, options, now), title, resolvedFormat}

  const tense = getTense(options)
  const style = getFormatStyle(options, format)
  if (resolvedFormat === 'duration') {
    if (format === 'micro' && tense !== 'auto') {
      const microDuration = getMicroDuration(duration, tense)
      const [value, unit] = getRelativeTimeUnit(microDuration.blank ? microEmptyDuration : microDuration)
      return {
        text: new Intl.RelativeTimeFormat(locale, {numeric: 'always', style: 'narrow'}).format(
          Math.abs(value) * (tense === 'past' ? -1 : 1),
          unit,
        ),
        title,
        resolvedFormat,
      }
    }

    const displayedDuration =
      format === 'micro'
        ? getMicroDuration(duration, tense)
        : (tense === 'past' && duration.sign !== -1) || (tense === 'future' && duration.sign !== 1)
          ? emptyDuration
          : duration
    return {
      text: formatDuration(
        displayedDuration.blank ? (format === 'micro' ? microEmptyDuration : emptyDuration) : displayedDuration.abs(),
        locale,
        style,
        displayedDuration.blank ? `${precision}sDisplay` : undefined,
      ),
      title,
      resolvedFormat,
    }
  }

  const relativeDuration =
    (tense === 'future' && duration.sign !== 1) || (tense === 'past' && duration.sign !== -1) ? emptyDuration : duration
  const [value, unit] = getRelativeTimeUnit(relativeDuration)
  const relativeFormat = new Intl.RelativeTimeFormat(locale, {numeric: 'auto', style})
  return {
    text:
      unit === 'second' && value < 10
        ? relativeFormat.format(0, precision === 'millisecond' ? 'second' : precision)
        : relativeFormat.format(value, unit as Intl.RelativeTimeFormatUnit),
    title,
    resolvedFormat,
  }
}
