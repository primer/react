import css, {SystemStyleObject} from '@styled-system/css'
import merge from 'deepmerge'

export interface SxProp {
  sx?: SystemStyleObject
}

const sx = (props: SxProp) => css(props.sx)

export default sx

export {merge}
