import {withSystemProps, TYPOGRAPHY} from './system-props'

const Heading = withSystemProps(
  {
    is: 'h1',
    fontSize: 5,
    m: 0
  },
  TYPOGRAPHY
)

export default Heading
