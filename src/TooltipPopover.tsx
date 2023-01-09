import React from 'react'
import {isSupported, apply} from '@oddbird/popover-polyfill/fn'

const TooltipPopover = () => {
  if (!isSupported()) {
    apply()
  }

  return (
    <div>
      <button popovertoggletarget="my-first-popover">Toggle popover</button>
      <div id="my-first-popover" popover="auto">
        Popover content
      </div>
    </div>
  )
}

export default TooltipPopover
