import styled from 'styled-components'
import Box, {BoxProps} from './Box'
import {BORDER, SystemBorderProps} from './constants'
import sx from './sx'
import {ForwardRefComponent, IntrinsicElement} from './utils/polymorphic'

export type BorderBoxProps = BoxProps & SystemBorderProps

type BorderBoxComponent = ForwardRefComponent<IntrinsicElement<typeof Box>, BorderBoxProps>

const BorderBox = styled(Box)<BorderBoxProps>`
  ${BORDER};
  ${sx};
` as BorderBoxComponent

BorderBox.defaultProps = {
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border.primary',
  borderRadius: 2
}

// export type BorderBoxProps = ComponentProps<typeof BorderBox>
export default BorderBox
