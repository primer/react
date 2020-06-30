import React from "react"
import styled from 'styled-components'
import PropTypes from 'prop-types'
import sx, {propTypes as sxPropTypes} from './sx'
import { COMMON, FLEX, LAYOUT, BaseProps, CommonProps, LayoutProps, FlexProps, StyleFnWithPropTypes } from './constants'
import theme from './theme'

const boxPropTypes = {
  ...COMMON.propTypes,
  ...FLEX.propTypes,
  ...LAYOUT.propTypes,
  ...sxPropTypes,
  theme: PropTypes.object
}

export type BoxProps = PropTypes.InferProps<typeof boxPropTypes>

const Box: React.FC<BoxProps> = styled.div`
  ${COMMON}
  ${FLEX}
  ${LAYOUT}
  ${sx};
`

Box.defaultProps = { theme }

Box.propTypes = boxPropTypes

export default Box
