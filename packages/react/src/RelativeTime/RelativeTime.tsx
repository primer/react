import {RelativeTimeElement} from '@github/relative-time-element'
import type {ComponentProps} from '../utils/types'
import {createComponent} from '../utils/custom-element'

const RelativeTime = createComponent(RelativeTimeElement, 'relative-time')

export type RelativeTimeProps = ComponentProps<typeof RelativeTime>
export default RelativeTime
