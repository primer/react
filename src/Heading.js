import system, {TYPOGRAPHY} from './system-props'

const Heading = system({
  is: 'h1',
  fontSize: 5,
  m: 0
}, ...TYPOGRAPHY)

export default Heading
