import styled from 'styled-components'
import Box, {BoxProps} from './Box'

export type BorderBoxProps = BoxProps

const BorderBox = styled(Box)``

BorderBox.defaultProps = {
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border.primary',
  borderRadius: 2
}

export default BorderBox
