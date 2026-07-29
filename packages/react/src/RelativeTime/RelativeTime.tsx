import type React from 'react'
import {forwardRef, useEffect, useMemo, useRef, useState} from 'react'

type RelativeTimeFormat = 'auto' | 'datetime' | 'duration' | 'elapsed' | 'micro' | 'relative'
type RelativeTimeTense = 'auto' | 'past' | 'future'
type RelativeTimePrecision = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'

export interface RelativeTimeUpdatedEvent {
  oldText: string
  newText: string
  oldTitle: string
  newTitle: string
}

export interface RelativeTimeProps extends Omit<React.ComponentPropsWithoutRef<'time'>, 'dateTime'> {
  date?: Date
  datetime?: string
  format?: RelativeTimeFormat
  tense?: RelativeTimeTense
  precision?: RelativeTimePrecision
  threshold?: string
  prefix?: string
  second?: Intl.DateTimeFormatOptions['second']
  minute?: Intl.DateTimeFormatOptions['minute']
  hour?: Intl.DateTimeFormatOptions['hour']
  weekday?: Intl.DateTimeFormatOptions['weekday']
  day?: Intl.DateTimeFormatOptions['day']
  month?: Intl.DateTimeFormatOptions['month']
  year?: Intl.DateTimeFormatOptions['year']
  timeZoneName?: Intl.DateTimeFormatOptions['timeZoneName']
  noTitle?: boolean
  onRelativeTimeUpdated?: (event: RelativeTimeUpdatedEvent) => void
}

interface Duration {
  year: number
  month: number
  week: number
  day: number
  hour: number
  minute: number
  second: number
}

const units: RelativeTimePrecision[] = ['year', 'month', 'day', 'hour', 'minute', 'second']

function getDate(date: Date | undefined, datetime: string | undefined) {
  if (datetime !== undefined) {
    const parsed = new Date(datetime)
    return Number.isNaN(parsed.getTime()) ? undefined : parsed
  }

  return date && !Number.isNaN(date.getTime()) ? date : undefined
}

function elapsedTime(date: Date, now: number, precision: RelativeTimePrecision): Duration {
  const difference = date.getTime() - now
  const sign = Math.sign(difference)
  const seconds = Math.floor(Math.abs(difference) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)
  const precisionIndex = units.indexOf(precision)

  return {
    year: precisionIndex >= 0 ? years * sign : 0,
    month: precisionIndex >= 1 ? (months - years * 12) * sign : 0,
    week: 0,
    day: precisionIndex >= 2 ? (days - months * 30) * sign : 0,
    hour: precisionIndex >= 3 ? (hours - days * 24) * sign : 0,
    minute: precisionIndex >= 4 ? (minutes - hours * 60) * sign : 0,
    second: precisionIndex >= 5 ? (seconds - minutes * 60) * sign : 0,
  }
}

function getRelativeTimeUnit(duration: Duration, now: number): [number, Intl.RelativeTimeFormatUnit] {
  const sign = Math.sign(
    duration.year ||
      duration.month ||
      duration.week ||
      duration.day ||
      duration.hour ||
      duration.minute ||
      duration.second,
  )
  let years = Math.abs(duration.year)
  let months = Math.abs(duration.month)
  let weeks = Math.abs(duration.week)
  let days = Math.abs(duration.day)
  let hours = Math.abs(duration.hour)
  let minutes = Math.abs(duration.minute)
  let seconds = Math.abs(duration.second)

  if (seconds >= 55) minutes += Math.round(seconds / 60)
  if (minutes || hours || days || weeks || months || years) seconds = 0
  if (minutes >= 55) hours += Math.round(minutes / 60)
  if (hours || days || weeks || months || years) minutes = 0
  if (days && hours >= 12) days += Math.round(hours / 24)
  if (!days && hours >= 21) days += Math.round(hours / 24)
  if (days || weeks || months || years) hours = 0

  if (days >= 27 || years + months + days) {
    const relativeTo = new Date(now)
    const currentYear = relativeTo.getFullYear()
    const currentMonth = relativeTo.getMonth()
    const currentDate = relativeTo.getDate()
    const newMonthDate = new Date(relativeTo)
    newMonthDate.setDate(1)
    newMonthDate.setMonth(currentMonth + months * sign + 1)
    newMonthDate.setDate(0)
    const monthDateCorrection = Math.max(0, currentDate - newMonthDate.getDate())
    const newDate = new Date(relativeTo)
    newDate.setFullYear(currentYear + years * sign)
    newDate.setDate(currentDate - monthDateCorrection)
    newDate.setMonth(currentMonth + months * sign)
    newDate.setDate(currentDate - monthDateCorrection + days * sign)
    const yearDiff = newDate.getFullYear() - relativeTo.getFullYear()
    const monthDiff = newDate.getMonth() - relativeTo.getMonth()
    const daysDiff = Math.abs(Math.round((Number(newDate) - Number(relativeTo)) / 86_400_000)) + monthDateCorrection
    const monthsDiff = Math.abs(yearDiff * 12 + monthDiff)

    if (daysDiff < 27) {
      if (days >= 6) {
        weeks += Math.round(days / 7)
        days = 0
      } else {
        days = daysDiff
      }
      months = years = 0
    } else if (monthsDiff <= 11) {
      months = monthsDiff
      years = 0
    } else {
      months = 0
      years = yearDiff * sign
    }
    if (months || years) days = 0
  }

  if (years) months = 0
  if (weeks >= 4) months += Math.round(weeks / 4)
  if (months || years) weeks = 0
  if (days && weeks && !months && !years) {
    weeks += Math.round(days / 7)
    days = 0
  }

  const rounded: Duration = {
    year: years * sign,
    month: months * sign,
    week: weeks * sign,
    day: days * sign,
    hour: hours * sign,
    minute: minutes * sign,
    second: seconds * sign,
  }
  for (const unit of units) {
    if (rounded[unit] !== 0) return [rounded[unit], unit]
  }

  return [0, 'second']
}

function applyDuration(date: Date, duration: string) {
  const match = duration.match(
    /^([-+])?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/,
  )
  if (!match) return undefined

  const sign = match[1] === '-' ? -1 : 1
  const values = match.slice(2).map(value => Number(value || 0) * sign)
  const [years, months, weeks, days, hours, minutes, seconds] = values
  const result = new Date(date)

  result.setUTCFullYear(result.getUTCFullYear() + years)
  result.setUTCMonth(result.getUTCMonth() + months)
  result.setUTCDate(result.getUTCDate() + weeks * 7 + days)
  result.setUTCHours(result.getUTCHours() + hours)
  result.setUTCMinutes(result.getUTCMinutes() + minutes)
  result.setUTCSeconds(result.getUTCSeconds() + seconds)

  return result
}

function isWithinThreshold(date: Date, now: number, threshold: string) {
  const thresholdDate = applyDuration(new Date(now), threshold)
  return thresholdDate ? Math.abs(date.getTime() - now) < Math.abs(thresholdDate.getTime() - now) : false
}

function getDateTimeOptions({
  date,
  now,
  format,
  second,
  minute,
  hour,
  weekday,
  day,
  month,
  year,
  timeZoneName,
}: Pick<RelativeTimeProps, 'second' | 'minute' | 'hour' | 'weekday' | 'day' | 'month' | 'year' | 'timeZoneName'> & {
  date: Date
  now: number
  format: RelativeTimeFormat
}): Intl.DateTimeFormatOptions {
  return {
    second,
    minute,
    hour,
    weekday: weekday ?? (format === 'datetime' ? 'short' : undefined),
    day: day ?? 'numeric',
    month: month ?? 'short',
    year: year ?? (date.getUTCFullYear() === new Date(now).getUTCFullYear() ? undefined : 'numeric'),
    timeZoneName,
  }
}

function getDurationText(duration: Duration, locale: string, style: 'long' | 'narrow') {
  const values = Object.fromEntries(
    Object.entries(duration)
      .filter(([, value]) => value !== 0)
      .map(([unit, value]) => [`${unit}s`, Math.abs(value)]),
  )

  if (Object.keys(values).length === 0) values.seconds = 0

  if (typeof Intl.DurationFormat !== 'undefined') {
    return new Intl.DurationFormat(locale, {style}).format(values)
  }

  const parts = Object.entries(values).map(([unit, value]) =>
    new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: unit.slice(0, -1) as Intl.NumberFormatOptions['unit'],
      unitDisplay: style,
    }).format(value as number),
  )
  return new Intl.ListFormat(locale, {style: 'short', type: 'unit'}).format(parts)
}

function getFormattedText(props: RelativeTimeProps, date: Date | undefined, now: number) {
  if (!date) return ''

  const {
    format = 'auto',
    tense = 'auto',
    precision = format === 'micro' ? 'minute' : 'second',
    threshold = 'P30D',
    prefix = format === 'datetime' ? '' : 'on',
    lang = 'en',
  } = props
  const duration = elapsedTime(date, now, precision)
  const formatAsDuration = format === 'duration' || format === 'elapsed' || format === 'micro'

  if (formatAsDuration) {
    const constrainedDuration =
      (tense === 'past' && date.getTime() >= now) || (tense === 'future' && date.getTime() <= now)
        ? {year: 0, month: 0, week: 0, day: 0, hour: 0, minute: 0, second: 0}
        : duration
    const [value, unit] = getRelativeTimeUnit(constrainedDuration, now)

    if (format === 'micro') {
      const microUnit = value === 0 ? 'minute' : unit
      return new Intl.NumberFormat(lang, {style: 'unit', unit: microUnit, unitDisplay: 'narrow'}).format(
        Math.max(1, Math.abs(value)),
      )
    }

    return getDurationText(constrainedDuration, lang, format === 'elapsed' ? 'narrow' : 'long')
  }

  if ((format === 'auto' || format === 'relative') && (tense !== 'auto' || isWithinThreshold(date, now, threshold))) {
    const constrainedDuration =
      (tense === 'past' && date.getTime() >= now) || (tense === 'future' && date.getTime() <= now)
        ? {year: 0, month: 0, week: 0, day: 0, hour: 0, minute: 0, second: 0}
        : duration
    const [value, unit] = getRelativeTimeUnit(constrainedDuration, now)
    const relativeValue = unit === 'second' && Math.abs(value) < 10 ? 0 : value
    return new Intl.RelativeTimeFormat(lang, {numeric: 'auto', style: 'long'}).format(relativeValue, unit)
  }

  const formatter = new Intl.DateTimeFormat(lang, getDateTimeOptions({...props, date, now, format}))
  return `${prefix} ${formatter.format(date)}`.trim()
}

function getTitle(date: Date | undefined, lang: string) {
  if (!date) return undefined
  return new Intl.DateTimeFormat(lang, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date)
}

function getUpdateInterval(date: Date | undefined, format: RelativeTimeFormat, precision: RelativeTimePrecision) {
  if (!date || format === 'datetime') return undefined
  if ((format === 'duration' || format === 'elapsed') && precision === 'second') return 1000
  if ((format === 'duration' || format === 'elapsed') && precision === 'minute') return 60_000

  const difference = Math.abs(Date.now() - date.getTime())
  if (difference < 60_000) return 1000
  if (difference < 3_600_000) return 60_000
  return 3_600_000
}

const RelativeTime = forwardRef<HTMLTimeElement, RelativeTimeProps>(function RelativeTime(
  {children, date: dateProp, datetime, format = 'auto', noTitle, onRelativeTimeUpdated, title, ...props},
  forwardedRef,
) {
  const date = useMemo(() => getDate(dateProp, datetime), [dateProp, datetime])
  const [now, setNow] = useState(() => Date.now())
  const [hasHydrated, setHasHydrated] = useState(false)
  const precision = props.precision ?? (format === 'micro' ? 'minute' : 'second')
  const formattedText = getFormattedText({...props, format}, date, now)
  const displayedText = date && (hasHydrated || children === undefined) ? formattedText : children
  const formattedTitle = title ?? (noTitle ? undefined : getTitle(date, props.lang ?? 'en'))
  const previous = useRef({text: displayedText?.toString() ?? '', title: formattedTitle ?? ''})

  useEffect(() => {
    setHasHydrated(true)

    const interval = getUpdateInterval(date, format, precision)
    if (interval === undefined) return

    const timer = window.setInterval(() => setNow(Date.now()), interval)
    return () => window.clearInterval(timer)
  }, [date, format, precision])

  useEffect(() => {
    const next = {text: displayedText?.toString() ?? '', title: formattedTitle ?? ''}
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-event-handler -- The callback reports timer-driven updates.
    if (next.text !== previous.current.text || next.title !== previous.current.title) {
      onRelativeTimeUpdated?.({
        oldText: previous.current.text,
        newText: next.text,
        oldTitle: previous.current.title,
        newTitle: next.title,
      })
      previous.current = next
    }
  }, [displayedText, formattedTitle, onRelativeTimeUpdated])

  return (
    <time
      ref={forwardedRef}
      {...props}
      dateTime={datetime ?? date?.toISOString()}
      title={formattedTitle}
      data-component="RelativeTime"
    >
      {displayedText}
    </time>
  )
})

export default RelativeTime
