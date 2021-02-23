import styled from 'styled-components'
import {COMMON, SystemCommonProps, SystemTypographyProps, TYPOGRAPHY} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'

const Text = styled.span<SystemTypographyProps & SystemCommonProps & SxProp>`
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

Text.defaultProps = {
  theme
}

export type TextProps = React.ComponentProps<typeof Text>
export default Text
