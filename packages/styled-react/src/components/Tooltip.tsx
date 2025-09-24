import {
    Box,
      Tooltip as PrimerTooltip,
  type TooltipProps as PrimerTooltipProps,
  type SxProp,
}from '@primer/react'
import {sx } from '../sx'
import type { ForwardRefComponent } from '../polymorphic'
import styled from 'styled-components'

type TooltipProps = PrimerTooltipProps & SxProp

const Tooltip = styled(PrimerTooltip).withConfig<TooltipProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

export { Tooltip}