import {Spinner as PrimerSpinner, type SpinnerProps as PrimerSpinnerProps} from '@primer/react'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'

export type SpinnerProps = PrimerSpinnerProps & SxProp

export const Spinner = styled(PrimerSpinner).withConfig({
  shouldForwardProp: prop => (prop as keyof SpinnerProps) !== 'sx',
})<SpinnerProps>`
  ${sx}
`
