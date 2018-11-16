import {withSystemProps, TYPOGRAPHY, COMMON} from './system-props'

const Text = withSystemProps('span', [...TYPOGRAPHY, ...COMMON])

export default Text
