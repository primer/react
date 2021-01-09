import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, CommonProps, FLEX, FlexProps, LAYOUT, LayoutProps} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'

export interface BoxProps extends CommonProps, FlexProps, LayoutProps, SxProp {}

const Box = styled.div<BoxProps>`
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

export default Box
