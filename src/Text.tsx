import styled from 'styled-components'
import {COMMON, SystemCommonProps, SystemTypographyProps, TYPOGRAPHY} from './constants'
import sx, {SxProp} from './sx'

const Text = styled.span<SystemTypographyProps & SystemCommonProps & SxProp>`
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

export type TextProps = React.ComponentProps<typeof Text>
export default Text
