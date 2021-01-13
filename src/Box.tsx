import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, CommonProps, FLEX, FlexProps, LAYOUT, LayoutProps} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'

const Box = styled.div<CommonProps & FlexProps & LayoutProps & SxProp>`
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
