export const unitNames = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'] as const

export type Unit = (typeof unitNames)[number]

type Sign = -1 | 0 | 1

const durationRe = /^[-+]?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/

export const isDuration = (value: string) => durationRe.test(value)

export class Duration {
  readonly years: number
  readonly months: number
  readonly weeks: number
  readonly days: number
  readonly hours: number
  readonly minutes: number
  readonly seconds: number
  readonly milliseconds: number
  readonly sign: Sign
  readonly blank: boolean

  constructor(years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0) {
    this.years = years || 0
    this.months = months || 0
    this.weeks = weeks || 0
    this.days = days || 0
    this.hours = hours || 0
    this.minutes = minutes || 0
    this.seconds = seconds || 0
    this.milliseconds = milliseconds || 0
    this.sign = (Math.sign(this.years) ||
      Math.sign(this.months) ||
      Math.sign(this.weeks) ||
      Math.sign(this.days) ||
      Math.sign(this.hours) ||
      Math.sign(this.minutes) ||
      Math.sign(this.seconds) ||
      Math.sign(this.milliseconds) ||
      0) as Sign
    this.blank = this.sign === 0
  }

  abs() {
    return new Duration(
      Math.abs(this.years),
      Math.abs(this.months),
      Math.abs(this.weeks),
      Math.abs(this.days),
      Math.abs(this.hours),
      Math.abs(this.minutes),
      Math.abs(this.seconds),
      Math.abs(this.milliseconds),
    )
  }

  static from(durationLike: unknown) {
    if (typeof durationLike === 'string') {
      const value = durationLike.trim()
      const factor = value.startsWith('-') ? -1 : 1
      const parsed = value
        .match(durationRe)
        ?.slice(1)
        .map(part => (Number(part) || 0) * factor)
      return parsed ? new Duration(...parsed) : new Duration()
    }

    if (typeof durationLike === 'object' && durationLike !== null) {
      const {years, months, weeks, days, hours, minutes, seconds, milliseconds} = durationLike as Partial<Duration>
      return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds)
    }

    throw new RangeError('invalid duration')
  }

  static compare(one: unknown, two: unknown): Sign {
    const now = Date.now()
    const oneApplied = Math.abs(applyDuration(now, Duration.from(one)).getTime() - now)
    const twoApplied = Math.abs(applyDuration(now, Duration.from(two)).getTime() - now)
    return oneApplied > twoApplied ? -1 : oneApplied < twoApplied ? 1 : 0
  }
}

export function applyDuration(date: Date | number, duration: Duration) {
  const result = new Date(date)

  if (duration.sign < 0) {
    result.setUTCSeconds(result.getUTCSeconds() + duration.seconds)
    result.setUTCMinutes(result.getUTCMinutes() + duration.minutes)
    result.setUTCHours(result.getUTCHours() + duration.hours)
    result.setUTCDate(result.getUTCDate() + duration.weeks * 7 + duration.days)
    result.setUTCMonth(result.getUTCMonth() + duration.months)
    result.setUTCFullYear(result.getUTCFullYear() + duration.years)
  } else {
    result.setUTCFullYear(result.getUTCFullYear() + duration.years)
    result.setUTCMonth(result.getUTCMonth() + duration.months)
    result.setUTCDate(result.getUTCDate() + duration.weeks * 7 + duration.days)
    result.setUTCHours(result.getUTCHours() + duration.hours)
    result.setUTCMinutes(result.getUTCMinutes() + duration.minutes)
    result.setUTCSeconds(result.getUTCSeconds() + duration.seconds)
  }

  return result
}

export function elapsedTime(date: Date, precision: Unit = 'second', now = Date.now()) {
  const delta = date.getTime() - now
  if (delta === 0) return new Duration()

  const sign = Math.sign(delta)
  const milliseconds = Math.abs(delta)
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)
  const precisionIndex = unitNames.indexOf(precision) || unitNames.length

  return new Duration(
    precisionIndex >= 0 ? years * sign : 0,
    precisionIndex >= 1 ? (months - years * 12) * sign : 0,
    0,
    precisionIndex >= 3 ? (days - months * 30) * sign : 0,
    precisionIndex >= 4 ? (hours - days * 24) * sign : 0,
    precisionIndex >= 5 ? (minutes - hours * 60) * sign : 0,
    precisionIndex >= 6 ? (seconds - minutes * 60) * sign : 0,
    precisionIndex >= 7 ? (milliseconds - seconds * 1000) * sign : 0,
  )
}

export function roundToSingleUnit(duration: Duration, {relativeTo = Date.now()}: {relativeTo?: Date | number} = {}) {
  const referenceDate = new Date(relativeTo)
  if (duration.blank) return duration

  const sign = duration.sign
  let years = Math.abs(duration.years)
  let months = Math.abs(duration.months)
  let weeks = Math.abs(duration.weeks)
  let days = Math.abs(duration.days)
  let hours = Math.abs(duration.hours)
  let minutes = Math.abs(duration.minutes)
  let seconds = Math.abs(duration.seconds)
  let milliseconds = Math.abs(duration.milliseconds)

  if (milliseconds >= 900) seconds += Math.round(milliseconds / 1000)
  if (seconds || minutes || hours || days || weeks || months || years) milliseconds = 0
  if (seconds >= 55) minutes += Math.round(seconds / 60)
  if (minutes || hours || days || weeks || months || years) seconds = 0
  if (minutes >= 55) hours += Math.round(minutes / 60)
  if (hours || days || weeks || months || years) minutes = 0
  if (days && hours >= 12) days += Math.round(hours / 24)
  if (!days && hours >= 21) days += Math.round(hours / 24)
  if (days || weeks || months || years) hours = 0

  const currentYear = referenceDate.getFullYear()
  const currentMonth = referenceDate.getMonth()
  const currentDate = referenceDate.getDate()

  if (days >= 27 || years + months + days) {
    const newMonthDate = new Date(referenceDate)
    newMonthDate.setDate(1)
    newMonthDate.setMonth(currentMonth + months * sign + 1)
    newMonthDate.setDate(0)
    const monthDateCorrection = Math.max(0, currentDate - newMonthDate.getDate())
    const newDate = new Date(referenceDate)
    newDate.setFullYear(currentYear + years * sign)
    newDate.setDate(currentDate - monthDateCorrection)
    newDate.setMonth(currentMonth + months * sign)
    newDate.setDate(currentDate - monthDateCorrection + days * sign)
    const yearDiff = newDate.getFullYear() - referenceDate.getFullYear()
    const monthDiff = newDate.getMonth() - referenceDate.getMonth()
    const daysDiff = Math.abs(Math.round((Number(newDate) - Number(referenceDate)) / 86_400_000)) + monthDateCorrection
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

  return new Duration(
    years * sign,
    months * sign,
    weeks * sign,
    days * sign,
    hours * sign,
    minutes * sign,
    seconds * sign,
    milliseconds * sign,
  )
}

export function getRelativeTimeUnit(
  duration: Duration,
  options?: {relativeTo?: Date | number},
): [number, Intl.RelativeTimeFormatUnit] {
  const rounded = roundToSingleUnit(duration, options)
  if (rounded.blank) return [0, 'second']

  for (const unit of unitNames) {
    if (unit === 'millisecond') continue
    const value = rounded[`${unit}s` as keyof Duration]
    if (value) return [value as number, unit]
  }

  return [0, 'second']
}
