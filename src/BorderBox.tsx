import styled from 'styled-components'
import Box, {BoxProps} from './Box'

export type BorderBoxProps = BoxProps

/**
 * @deprecated Use the Box component instead (i.e. <BorderBox> → <Box borderWidth='1px' borderStyle='solid' borderColor='border.primary' borderRadius={2}>)
 */
const BorderBox = styled(Box)``

BorderBox.defaultProps = {
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border.default',
  borderRadius: 2
}

export default BorderBox
