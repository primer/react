import React from 'react'
import type {PropsWithChildren} from 'react'
import {useRender} from '../hooks/useRender'
import type {RenderComponentProps} from '../hooks/useRender'
import {mergeProps} from '../utils/mergeProps'
import {BasePopoverContext, useBasePopoverContext} from './BasePopoverContext'
import {useBasePopover} from './useBasePopover'
import type {UseBasePopoverConfig} from './useBasePopover'

type RootProps = PropsWithChildren<UseBasePopoverConfig>

function Root({children, id, popover}: RootProps) {
  const value = useBasePopover({
    id,
    popover,
  })
  return <BasePopoverContext.Provider value={value}>{children}</BasePopoverContext.Provider>
}

type TriggerProps = RenderComponentProps<'button'>

const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(function Trigger({render, ...rest}, forwardedRef) {
  const {getTriggerProps} = useBasePopoverContext()

  return useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps({type: 'button', ...getTriggerProps()}, rest),
    ref: forwardedRef,
  })
})

type PopoverProps = RenderComponentProps<'div'>

const Popover = React.forwardRef<HTMLElement, PopoverProps>(function Popover({render, ...rest}, forwardedRef) {
  const {getPopoverProps} = useBasePopoverContext()

  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps(getPopoverProps(), rest),
    ref: forwardedRef,
  })
})

type CloseProps = RenderComponentProps<'button'>

const Close = React.forwardRef<HTMLButtonElement, CloseProps>(function Close({render, ...rest}, forwardedRef) {
  const {getCloseProps} = useBasePopoverContext()

  return useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps({type: 'button', ...getCloseProps()}, rest),
    ref: forwardedRef,
  })
})

export {Root, Trigger, Popover, Close}
export type {RootProps, TriggerProps, PopoverProps, CloseProps}
