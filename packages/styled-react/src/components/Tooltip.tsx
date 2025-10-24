import {Tooltip as PrimerTooltip, type TooltipProps as PrimerTooltipProps, type SlotMarker} from '@primer/react'
import {Box} from './Box'
import {forwardRef, type ForwardRefExoticComponent, type RefAttributes} from 'react'
import type {SxProp} from '../sx'

type TooltipProps = PrimerTooltipProps & SxProp

const Tooltip: ForwardRefExoticComponent<TooltipProps & RefAttributes<HTMLDivElement>> & SlotMarker = forwardRef<
  HTMLDivElement,
  TooltipProps
>(function Tooltip(props, ref) {
  return <Box {...props} as={PrimerTooltip} ref={ref} />
})

Tooltip.__SLOT__ = PrimerTooltip.__SLOT__

export {Tooltip, type TooltipProps}
