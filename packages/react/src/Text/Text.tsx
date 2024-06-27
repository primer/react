import styled from 'styled-components'
import type {SystemCommonProps, SystemTypographyProps} from '../constants'
import {COMMON, TYPOGRAPHY} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

const Text = styled.span<SystemTypographyProps & SystemCommonProps & SxProp>`
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

export type TextProps = ComponentProps<typeof Text>
export default Text
