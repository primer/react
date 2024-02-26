import React from 'react'
import {RelativeTimeElement} from '@github/relative-time-element'
import type {ComponentProps} from '../utils/types'
import {createComponent} from '../utils/custom-element'

const RelativeTimeComponent = createComponent(RelativeTimeElement, 'relative-time')

const localeOptions: Intl.DateTimeFormatOptions = {month: 'short', day: 'numeric', year: 'numeric'}
function RelativeTime({date, ...props}: RelativeTimeProps) {
  return (
    <RelativeTimeComponent {...props} date={date}>
      ${date?.toLocaleDateString('en', localeOptions) || ''}
    </RelativeTimeComponent>
  )
}

export type RelativeTimeProps = ComponentProps<typeof RelativeTimeComponent>
export default RelativeTime
