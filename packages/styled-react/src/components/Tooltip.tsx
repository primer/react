import {
  Tooltip as PrimerTooltip,
  type TooltipProps as PrimerTooltipProps,
  type SxProp,
  type SlotMarker,
} from '@primer/react'
import {Box} from './Box'
import {forwardRef, type ForwardRefExoticComponent, type RefAttributes} from 'react'

type TooltipProps = PrimerTooltipProps & SxProp

const Tooltip: ForwardRefExoticComponent<TooltipProps & RefAttributes<HTMLDivElement>> & SlotMarker = forwardRef<
  HTMLDivElement,
  TooltipProps
>(function Tooltip(props, ref) {
  return <Box as={PrimerTooltip} ref={ref} {...props} />
})

Tooltip.__SLOT__ = PrimerTooltip.__SLOT__

export {Tooltip, type TooltipProps}
