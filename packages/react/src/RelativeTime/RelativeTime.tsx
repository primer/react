// Importing the package defines the `<relative-time>` custom element as a side effect.
import '@github/relative-time-element'
import type {RelativeTimeElement} from '@github/relative-time-element'
import React, {useEffect, useRef} from 'react'
import {useMergedRefs} from '../hooks/useMergedRefs'
import {isExperimentalReactVersion, reactMajorVersion} from '../utils/environment'

// React 19 maps `className` to `class` on custom elements, React 18 does not.
const classNameProp = reactMajorVersion >= 19 || isExperimentalReactVersion ? 'className' : 'class'

// Format options the element omits from its output when set to an empty string.
type OptionalFormatProps = 'second' | 'minute' | 'hour' | 'weekday' | 'day' | 'month' | 'year' | 'timeZoneName'
const optionalFormatProps = [
  'second',
  'minute',
  'hour',
  'weekday',
  'day',
  'month',
  'year',
  'timeZoneName',
] as const satisfies readonly OptionalFormatProps[]

type RelativeTimeElementProps = {
  [K in OptionalFormatProps]?: RelativeTimeElement[K] | ''
} & Partial<
  Pick<
    RelativeTimeElement,
    'prefix' | 'threshold' | 'tense' | 'precision' | 'format' | 'formatStyle' | 'datetime' | 'onRelativeTimeUpdated'
  >
>

export type RelativeTimeProps = RelativeTimeElementProps &
  Omit<React.HTMLAttributes<RelativeTimeElement>, keyof RelativeTimeElementProps> & {
    date?: Date | null
    noTitle?: boolean
    timeZone?: string
  }

const localeOptions: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
} satisfies Intl.DateTimeFormatOptions

function toAttributeName(prop: string): string {
  return prop.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
}

function toISOString(date: Date | null | undefined): string | undefined {
  if (!date || Number.isNaN(date.getTime())) return undefined
  return date.toISOString()
}

const RelativeTime = React.forwardRef<RelativeTimeElement, RelativeTimeProps>(
  function RelativeTime(allProps, forwardedRef) {
    const {
      date: dateProp,
      datetime,
      children,
      className,
      noTitle,
      second,
      minute,
      hour,
      weekday,
      day,
      month,
      year,
      timeZoneName,
      prefix,
      threshold,
      tense,
      precision,
      format,
      formatStyle,
      timeZone,
      onRelativeTimeUpdated,
      ...props
    } = allProps
    const elementRef = useRef<RelativeTimeElement>(null)
    const ref = useMergedRefs(forwardedRef, elementRef)

    // `onRelativeTimeUpdated` is a property-only callback on the element, so it is applied on the client.
    useEffect(() => {
      const element = elementRef.current
      if (!element) return
      element.onRelativeTimeUpdated = onRelativeTimeUpdated ?? null
      return () => {
        element.onRelativeTimeUpdated = null
      }
    }, [onRelativeTimeUpdated])

    const date = datetime ? new Date(datetime) : dateProp
    const optionalFormatValues = {second, minute, hour, weekday, day, month, year, timeZoneName}
    const optionalFormatAttributes: Record<string, string> = {}
    for (const prop of optionalFormatProps) {
      // An explicitly provided empty (or `undefined`) value omits the field from the element's output, so it is
      // rendered as an empty attribute rather than dropped.
      if (prop in allProps) optionalFormatAttributes[toAttributeName(prop)] = optionalFormatValues[prop] || ''
    }

    // Values are rendered as attributes (rather than set as element properties in an effect) so that they are
    // included in server-rendered markup and the element can format the date before hydration.
    return React.createElement(
      'relative-time',
      {
        // The element manages its own attributes (e.g. `title`), which it may update before hydration.
        suppressHydrationWarning: true,
        ...props,
        [classNameProp]: className,
        ref,
        datetime: datetime || toISOString(date),
        ...optionalFormatAttributes,
        prefix,
        threshold,
        tense,
        precision,
        format,
        'format-style': formatStyle,
        'time-zone': timeZone,
        'no-title': noTitle ? '' : undefined,
        'data-component': 'RelativeTime',
      },
      children || date?.toLocaleDateString('en', localeOptions) || '',
    )
  },
)

RelativeTime.displayName = 'RelativeTime'

export default RelativeTime
