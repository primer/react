import {Tooltip as PrimerTooltip, type TooltipProps as PrimerTooltipProps} from '@primer/react/deprecated'
import {forwardRef} from 'react'
import {sx, type SxProp} from '../../sx'
import {type PropsWithChildren} from 'react'
import styled from 'styled-components'
import type {SlotMarker} from '@primer/react'

// Add explicit `as` prop since polymorphic typing doesn't carry over to type aliases
type TooltipProps = PropsWithChildren<PrimerTooltipProps & SxProp & {as?: React.ElementType}>

const StyledTooltip = styled(PrimerTooltip).withConfig({
  shouldForwardProp: prop => (prop as keyof TooltipProps) !== 'sx',
})<TooltipProps>`
  ${sx}
`

const TooltipImpl = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip({as, ...props}, ref) {
  return <StyledTooltip {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
})

const Tooltip = TooltipImpl as typeof TooltipImpl & {
  alignments: string[]
  directions: string[]
}

// Preserve static properties from the original component
Tooltip.alignments = PrimerTooltip.alignments
Tooltip.directions = PrimerTooltip.directions
;(Tooltip as typeof Tooltip & SlotMarker).__SLOT__ = PrimerTooltip.__SLOT__

export {Tooltip, type TooltipProps}
