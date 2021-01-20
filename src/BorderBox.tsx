import styled from 'styled-components'
import sx from './sx'
import PropTypes from 'prop-types'
import Box from './Box'
import theme from './theme'
import {BORDER, SystemBorderProps} from './constants'

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

export type BorderBoxProps = React.ComponentProps<typeof BorderBox>
export default BorderBox
