import styled from 'styled-components'
import Box from './Box'
import theme from './theme'
import {BORDER} from './constants'

const BorderBox = styled(Box)(BORDER)

BorderBox.defaultProps = {
  theme,
  border: '1px solid',
  borderColor: 'gray.2',
  borderRadius: 1
}

// spread prop types here
BorderBox.propTypes = {
  ...Box.propTypes,
  ...BORDER.propTypes
}

export default BorderBox
