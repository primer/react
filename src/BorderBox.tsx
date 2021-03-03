import styled from 'styled-components'
import Box from './Box'
import {BORDER, SystemBorderProps} from './constants'
import sx from './sx'
import {ComponentProps} from './utils/types'

const BorderBox = styled(Box)<SystemBorderProps>`
  ${BORDER};
  ${sx};
`

BorderBox.defaultProps = {
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border.primary',
  borderRadius: 2
}

export type BorderBoxProps = ComponentProps<typeof BorderBox>
export default BorderBox
