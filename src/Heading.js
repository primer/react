import {withSystemProps, TYPOGRAPHY, COMMON} from './system-props'

const Heading = withSystemProps(
  {
    is: 'h1',
    fontSize: 5,
    m: 0
  },
  [...TYPOGRAPHY, ...COMMON]
)

export default Heading
