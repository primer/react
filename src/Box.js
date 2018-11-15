import {withSystemProps, LAYOUT, COMMON} from './system-props'

const Box = withSystemProps('div', [...LAYOUT, ...COMMON])

export default Box
