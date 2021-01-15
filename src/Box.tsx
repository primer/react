import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, SystemCommonProps, FLEX, SystemFlexProps, LAYOUT, SystemLayoutProps} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'

const Box = styled.div<SystemCommonProps & SystemFlexProps & SystemLayoutProps & SxProp>`
  ${COMMON}
  ${FLEX}
  ${LAYOUT}
  ${sx};
`

Box.defaultProps = {theme}

Box.propTypes = {
  ...COMMON.propTypes,
  ...FLEX.propTypes,
  ...LAYOUT.propTypes,
  ...sx.propTypes,
  theme: PropTypes.object,
}

export type BoxProps = React.ComponentProps<typeof Box>
export default Box
