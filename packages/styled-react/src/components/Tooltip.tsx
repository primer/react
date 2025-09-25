import {Tooltip as PrimerTooltip, type TooltipProps as PrimerTooltipProps, type SxProp} from '@primer/react'
import {
  Tooltip as PrimerDeprecatedTooltip,
  type TooltipProps as PrimerDeprecatedTooltipProps,
} from '@primer/react/deprecated'
import {Box} from './Box'
import {forwardRef, type ForwardRefExoticComponent, type RefAttributes} from 'react'

type TooltipProps = PrimerTooltipProps & SxProp

const Tooltip: ForwardRefExoticComponent<TooltipProps & RefAttributes<HTMLDivElement>> = forwardRef<
  HTMLDivElement,
  TooltipProps
>(function Tooltip(props, ref) {
  return <Box as={PrimerTooltip} ref={ref} {...props} />
})

export {Tooltip, type TooltipProps}

type DeprecatedTooltipProps = PrimerDeprecatedTooltipProps & SxProp

const DeprecatedTooltip = function (props: DeprecatedTooltipProps) {
  return <Box as={PrimerDeprecatedTooltip} {...props} />
}
export {DeprecatedTooltip, type DeprecatedTooltipProps}
