import system from 'system-components/emotion'
import {TYPOGRAPHY} from './system-props'

const Text = system(...TYPOGRAPHY)

Object.assign(Text.defaultProps, {
  is: 'span'
})

export default Text
