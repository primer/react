import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

const Pagehead = styled.div<SystemCommonProps & SxProp>`
  position: relative;
  padding-top: ${get('space.4')};
  padding-bottom: ${get('space.4')};
  margin-bottom: ${get('space.4')};
  border-bottom: 1px solid ${get('colors.border.primary')};
  ${COMMON};
  ${sx};
`

Pagehead.defaultProps = {
  theme
}

Pagehead.propTypes = {
  children: PropTypes.node,
  ...COMMON.propTypes,
  ...sx.propTypes
}

export type PageheadProps = ComponentProps<typeof Pagehead>
export default Pagehead
