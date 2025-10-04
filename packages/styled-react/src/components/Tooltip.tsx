import {Tooltip as PrimerTooltip, type TooltipProps as PrimerTooltipProps, type SxProp} from '@primer/react'
import {
  Tooltip as PrimerDeprecatedTooltip,
  type TooltipProps as PrimerDeprecatedTooltipProps,
} from '@primer/react/deprecated'
import {Box} from './Box'
import {forwardRef, type ForwardRefExoticComponent, type RefAttributes, type ComponentType} from 'react'

type TooltipProps = PrimerTooltipProps & SxProp

const Tooltip: ForwardRefExoticComponent<TooltipProps & RefAttributes<HTMLDivElement>> = forwardRef<
  HTMLDivElement,
  TooltipProps
>(function Tooltip(props, ref) {
  return <Box as={PrimerTooltip} ref={ref} {...props} />
})

export {Tooltip, type TooltipProps}

type DeprecatedTooltipProps = PrimerDeprecatedTooltipProps & SxProp

// Cast the polymorphic component to a compatible type for styled-components
const DeprecatedTooltipComponent = PrimerDeprecatedTooltip as ComponentType<PrimerDeprecatedTooltipProps>

const DeprecatedTooltip: ForwardRefExoticComponent<DeprecatedTooltipProps & RefAttributes<HTMLSpanElement>> =
  forwardRef<HTMLSpanElement, DeprecatedTooltipProps>(function DeprecatedTooltip(props, ref) {
    return <Box as={DeprecatedTooltipComponent} ref={ref} {...props} />
  })
export {DeprecatedTooltip, type DeprecatedTooltipProps}
