import {type SxProp, Text as PrimerText, type TextProps as PrimerTextProps} from '@primer/react'
import {sx} from '../sx'
import styled from 'styled-components'

type TextProps = PrimerTextProps & SxProp

const Text = styled(PrimerText).withConfig<TextProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

export {Text, type TextProps}
