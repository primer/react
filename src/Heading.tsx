import styled from 'styled-components'
import sx, {SxProp} from './sx'
import PropTypes from 'prop-types'
import {TYPOGRAPHY, COMMON, get, SystemTypographyProps, SystemCommonProps} from './constants'
import theme from './theme'

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

Heading.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes,
  theme: PropTypes.object,
  ...TYPOGRAPHY.propTypes
}

export type HeadingProps = React.ComponentProps<typeof Heading>
export default Heading
