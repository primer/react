import React from 'react'
import {RelativeTimeElement} from '@github/relative-time-element'
import type {ComponentProps} from '../utils/types'
import {createComponent} from '../utils/customElement'

const RelativeTimeComponent = createComponent(RelativeTimeElement, 'relative-time')

const localeOptions: Intl.DateTimeFormatOptions = {month: 'short', day: 'numeric', year: 'numeric'}
function RelativeTime({date, datetime, children, ...props}: RelativeTimeProps) {
  if (datetime) date = new Date(datetime)
  return (
    <RelativeTimeComponent {...props} date={date}>
      {children || date?.toLocaleDateString('en', localeOptions) || ''}
    </RelativeTimeComponent>
  )
}

export type RelativeTimeProps = ComponentProps<typeof RelativeTimeComponent>
export default RelativeTime
