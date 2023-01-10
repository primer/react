import React from 'react'
import {isSupported, apply} from '@oddbird/popover-polyfill/fn'
import styled from 'styled-components'
import sx, {SxProp} from './sx'

interface PopoverProps extends SxProp, React.PropsWithChildren {
  popover: 'auto' | 'manual'
  id: string
}

const TooltipContent = styled('div')
  .withConfig({
    shouldForwardProp: (prop, defaultValidatorFn) => ['popover'].includes(prop) || defaultValidatorFn(prop),
  })
  .attrs<PopoverProps>(props => ({
    popover: props.popover,
    id: props.id,
  }))<PopoverProps>`
  ${sx}
`

const TooltipPopover = () => {
  if (!isSupported()) {
    apply()
  }

  return (
    <div>
      <button popovertoggletarget="my-first-popover">Toggle popover</button>
      <TooltipContent popover="auto" id="my-first-popover">
        Popover Content
      </TooltipContent>
    </div>
  )
}

export default TooltipPopover
