import {Box, type SxProp} from '@primer/react'
import {Tooltip as PrimerTooltip, type TooltipProps as PrimerTooltipProps} from '@primer/react/experimental'
import React, {forwardRef, type ForwardRefExoticComponent, type RefAttributes} from 'react'

type TooltipProps = PrimerTooltipProps & SxProp

const Tooltip: ForwardRefExoticComponent<TooltipProps & RefAttributes<HTMLDivElement>> = forwardRef<
  HTMLDivElement,
  TooltipProps
>(function Tooltip(props, ref) {
  return <Box as={PrimerTooltip} ref={ref} {...props} />
})

export {Tooltip, type TooltipProps}

export {Dialog, PageHeader, Table, UnderlinePanels} from '@primer/react/experimental'
