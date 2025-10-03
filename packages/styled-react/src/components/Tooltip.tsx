import {Tooltip as PrimerTooltip, type TooltipProps as PrimerTooltipProps, type SxProp} from '@primer/react'
import {
  Tooltip as PrimerDeprecatedTooltip,
  type TooltipProps as PrimerDeprecatedTooltipProps,
} from '@primer/react/deprecated'
import {Box} from './Box'
import {forwardRef, type ForwardRefExoticComponent, type RefAttributes, type ComponentType, type RefObject} from 'react'

type TooltipProps = PrimerTooltipProps & SxProp

const Tooltip: ForwardRefExoticComponent<TooltipProps & RefAttributes<HTMLDivElement>> = forwardRef<
  HTMLDivElement,
  TooltipProps
>(function Tooltip(props, ref) {
  return <Box as={PrimerTooltip} ref={ref} {...props} />
})

export {Tooltip, type TooltipProps}

type DeprecatedTooltipProps = PrimerDeprecatedTooltipProps & SxProp

const DeprecatedTooltipComponent = PrimerDeprecatedTooltip as ComponentType<PrimerDeprecatedTooltipProps>

const DeprecatedTooltip: ForwardRefExoticComponent<DeprecatedTooltipProps & RefAttributes<HTMLSpanElement>> =
  forwardRef<HTMLSpanElement, DeprecatedTooltipProps>(function DeprecatedTooltip(props, forwardedRef) {
    // Filter out legacy string refs that styled-components doesn't support
    const ref: RefObject<HTMLSpanElement> | ((instance: HTMLSpanElement | null) => void) | null | undefined =
      typeof forwardedRef === 'string' ? null : forwardedRef

    return <Box as={DeprecatedTooltipComponent} ref={ref} {...props} />
  })

export {DeprecatedTooltip, type DeprecatedTooltipProps}
