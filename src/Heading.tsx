import styled from 'styled-components'
import {COMMON, get, SystemCommonProps, SystemTypographyProps, TYPOGRAPHY} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

const Heading = styled.h2<SystemTypographyProps & SystemCommonProps & SxProp>`
  font-weight: ${get('fontWeights.bold')};
  font-size: ${get('fontSizes.5')};
  margin: 0;
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

Heading.defaultProps = {
  theme
}

export type HeadingProps = ComponentProps<typeof Heading>
export default Heading
