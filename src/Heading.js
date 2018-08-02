import system from 'system-components/emotion'
import {TYPOGRAPHY} from './system-props'

const Heading = system(...TYPOGRAPHY)

Object.assign(Heading.defaultProps, {
  is: 'h1',
  fontSize: 5,
  m: 0
})

export default Heading
