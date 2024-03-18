import React from 'react'
import {RelativeTimeElement} from '@github/relative-time-element'
import type {ComponentProps} from '../utils/types'
import {createComponent} from '../utils/custom-element'

const RelativeTimeComponent = createComponent(RelativeTimeElement, 'relative-time')

interface RelativeTimePropsWithDate extends ComponentProps<typeof RelativeTimeComponent> {
  datetime: never
}

interface RelativeTimePropsWithDateTime extends ComponentProps<typeof RelativeTimeComponent> {
  date: never
}

export type RelativeTimeProps = RelativeTimePropsWithDateTime | RelativeTimePropsWithDate

const localeOptions: Intl.DateTimeFormatOptions = {month: 'short', day: 'numeric', year: 'numeric'}
function RelativeTime({date, datetime, ...props}: RelativeTimeProps) {
  if (date && datetime) throw new Error(`Ambiguous use of both date and datetime props`)
  if (datetime) date = new Date(datetime)
  return (
    <RelativeTimeComponent {...props} date={date}>
      {date?.toLocaleDateString('en', localeOptions) || ''}
    </RelativeTimeComponent>
  )
}

export default RelativeTime
