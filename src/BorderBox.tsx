import PropTypes from 'prop-types'
import styled from 'styled-components'
import Box from './Box'
import {BORDER, SystemBorderProps} from './constants'
import sx from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

const BorderBox = styled(Box)<SystemBorderProps>`
  ${BORDER};
  ${sx};
`

BorderBox.defaultProps = {
  theme,
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'gray.2',
  borderRadius: 2
}

BorderBox.propTypes = {
  ...Box.propTypes,
  ...BORDER.propTypes,
  ...sx.propTypes,
  theme: PropTypes.object
}

export type BorderBoxProps = ComponentProps<typeof BorderBox>
export default BorderBox
