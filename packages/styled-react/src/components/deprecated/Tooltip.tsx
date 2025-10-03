import {Tooltip as PrimerTooltip, type TooltipProps as PrimerTooltipProps} from '@primer/react/deprecated'
import {Box} from '../Box'
import {forwardRef, type RefAttributes, type ComponentType} from 'react'
import {sx, type SxProp} from '../../sx'
import {type PropsWithChildren} from 'react'
import styled from 'styled-components'
import type {ForwardRefComponent} from '../../polymorphic'

type TooltipProps = PropsWithChildren<PrimerTooltipProps & SxProp>

const StyledTooltip = styled(PrimerTooltip).withConfig({
  shouldForwardProp: prop => (prop as keyof TooltipProps) !== 'sx',
})<TooltipProps>`
  ${sx}
`

const Tooltip = forwardRef(function Tooltip({as, ...props}, ref) {
  return <StyledTooltip {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
}) as ForwardRefComponent<'span', TooltipProps> & {
  alignments: string[]
  directions: string[]
}

export {Tooltip, type TooltipProps}
