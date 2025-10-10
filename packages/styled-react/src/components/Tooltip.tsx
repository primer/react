import {Tooltip as PrimerTooltip, type TooltipProps as PrimerTooltipProps, type SxProp} from '@primer/react'
import {Box} from './Box'
import {forwardRef, type ForwardRefExoticComponent, type RefAttributes} from 'react'

type TooltipProps = PrimerTooltipProps & SxProp

const Tooltip: ForwardRefExoticComponent<TooltipProps & RefAttributes<HTMLDivElement>> = forwardRef<
  HTMLDivElement,
  TooltipProps
>(function Tooltip(props, ref) {
  return <Box as={PrimerTooltip} ref={ref} {...props} />
})

// @ts-ignore - TypeScript doesn't know about the __SLOT__ property
Tooltip.__SLOT__ = PrimerTooltip.__SLOT__

export {Tooltip, type TooltipProps}
