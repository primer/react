import '../polyfills/invoker-commands'
import {useId} from '../hooks/useId'

type UseBasePopoverConfig = {
  id?: string
  popover?: PopoverValue
}

type UseBasePopoverReturn = {
  getTriggerProps: () => BaseTriggerProps
  getPopoverProps: () => BasePopoverProps
  getCloseProps: () => BaseCloseProps
}

type BaseTriggerProps = {
  commandfor: string
  command: 'toggle-popover'
}

type PopoverValue = 'auto' | 'hint' | 'manual'

type BasePopoverProps = {
  id: string
  popover: PopoverValue
}

type BaseCloseProps = {
  commandfor: string
  command: 'hide-popover'
}

function useBasePopover({id, popover = 'auto'}: UseBasePopoverConfig = {}): UseBasePopoverReturn {
  const popoverId = useId(id)

  function getTriggerProps(): BaseTriggerProps {
    return {
      commandfor: popoverId,
      command: 'toggle-popover',
    }
  }

  function getPopoverProps(): BasePopoverProps {
    return {
      id: popoverId,
      popover,
    }
  }

  function getCloseProps(): BaseCloseProps {
    return {
      commandfor: popoverId,
      command: 'hide-popover',
    }
  }

  return {
    getTriggerProps,
    getPopoverProps,
    getCloseProps,
  }
}

export {useBasePopover}
export type {UseBasePopoverConfig, UseBasePopoverReturn}
