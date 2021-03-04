import css, {SystemStyleObject} from '@styled-system/css'

export interface SxProp {
  sx?: SystemStyleObject
}

const sx = (props: SxProp) => css(props.sx)

export default sx
