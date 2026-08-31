import {RelativeTimeElement} from '@github/relative-time-element'
import {useFeatureFlag} from '../FeatureFlags'
import {createComponent} from '../utils/create-component'
import ExperimentalRelativeTime from './ExperimentalRelativeTime'
import type {ExperimentalRelativeTimeProps} from './ExperimentalRelativeTime'
import type {ComponentProps} from '../utils/types'

const RelativeTimeComponent = createComponent(RelativeTimeElement, 'relative-time')

const localeOptions: Intl.DateTimeFormatOptions = {month: 'short', day: 'numeric', year: 'numeric'}

export type RelativeTimeProps = ComponentProps<typeof RelativeTimeComponent>

function RelativeTime(props: RelativeTimeProps) {
  const reactImplementationEnabled = useFeatureFlag('primer_react_relative_time')
  const {precision, ...propsWithoutPrecision} = props
  const supportsReactImplementation = precision !== 'millisecond' && precision !== 'week'

  if (reactImplementationEnabled && supportsReactImplementation) {
    // Event handler targets change from RelativeTimeElement to HTMLTimeElement only when this internal flag is enabled.
    return (
      <ExperimentalRelativeTime {...(propsWithoutPrecision as ExperimentalRelativeTimeProps)} precision={precision} />
    )
  }

  const {date, datetime, children, noTitle, ...relativeTimeProps} = propsWithoutPrecision
  const parsedDate = datetime ? new Date(datetime) : date

  return (
    <RelativeTimeComponent
      {...relativeTimeProps}
      date={parsedDate}
      precision={precision}
      no-title={noTitle ? '' : undefined}
      data-component="RelativeTime"
    >
      {children || parsedDate?.toLocaleDateString('en', localeOptions) || ''}
    </RelativeTimeComponent>
  )
}

export default RelativeTime
