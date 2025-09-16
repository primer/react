import {Box, type SxProp} from '@primer/react'
import {Tooltip as PrimerTooltip, type TooltipProps as PrimerTooltipProps} from '@primer/react/deprecated'
import React, {forwardRef} from 'react'

type TooltipProps = PrimerTooltipProps & SxProp

const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(props, ref) {
  return <Box as={PrimerTooltip} ref={ref} {...props} />
})

export {Tooltip, type TooltipProps}

export {Dialog, Octicon, TabNav} from '@primer/react/deprecated'
