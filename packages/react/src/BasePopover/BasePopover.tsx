import type {HTMLAttributes, PropsWithChildren} from 'react'
import {BasePopoverContext, useBasePopoverContext} from './BasePopoverContext'
import {useBasePopover} from './useBasePopover'
import type {UseBasePopoverConfig} from './useBasePopover'
import {mergeProps} from '../utils/mergeProps'

type RootProps = PropsWithChildren<UseBasePopoverConfig>

function Root({children, id, popover}: RootProps) {
  const value = useBasePopover({
    id,
    popover,
  })
  return <BasePopoverContext.Provider value={value}>{children}</BasePopoverContext.Provider>
}

type TriggerProps = HTMLAttributes<HTMLButtonElement> & {}

function Trigger({children, ...rest}: TriggerProps) {
  const {getTriggerProps} = useBasePopoverContext()
  const triggerProps = getTriggerProps()
  return (
    <button type="button" {...mergeProps(triggerProps, rest)}>
      {children}
    </button>
  )
}

type PopoverProps = HTMLAttributes<HTMLElement> & {}

function Popover({children, ...rest}: PopoverProps) {
  const {getPopoverProps} = useBasePopoverContext()
  const popoverProps = getPopoverProps()
  return <div {...mergeProps(popoverProps, rest)}>{children}</div>
}

type CloseProps = HTMLAttributes<HTMLButtonElement> & {}

function Close({children, ...rest}: CloseProps) {
  const {getCloseProps} = useBasePopoverContext()
  const closeProps = getCloseProps()
  return (
    <button type="button" {...mergeProps(closeProps, rest)}>
      {children}
    </button>
  )
}

export {Root, Trigger, Popover, Close}
export type {RootProps, TriggerProps, PopoverProps, CloseProps}
