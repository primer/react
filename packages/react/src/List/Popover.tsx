import {createElement, useId, useMemo} from 'react'
import type {ComponentPropsWithoutRef, ElementType, PropsWithChildren, ReactEventHandler} from 'react'
import {PopoverContext, usePopover} from './PopoverContext'
import classes from './Popover.module.css'

function Root({children}: PropsWithChildren) {
  const popoverId = useId()
  const value = useMemo(() => {
    return {
      popoverId,
    }
  }, [popoverId])
  return (
    <div className={classes.Root}>
      <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
    </div>
  )
}

type TriggerProps = ComponentPropsWithoutRef<'button'> & {
  as?: ElementType
}

function Trigger({as: BaseComponent = 'button', ...rest}: TriggerProps) {
  const {popoverId} = usePopover()
  const props = {
    type: 'button',
    commandfor: popoverId,
    command: 'toggle-popover',
    className: classes.Trigger,
    ...rest,
  }

  return createElement(BaseComponent, props)
}

type PopoverProps = ComponentPropsWithoutRef<'div'> & {
  onToggle?: ReactEventHandler<HTMLDivElement>
  popover?: '' | 'auto' | 'manual'
}

function Popover(props: PopoverProps) {
  const {popoverId} = usePopover()
  const popoverProps = {
    id: popoverId,
    className: classes.Popover,
    popover: '',
    ...props,
  }

  return <div {...popoverProps} />
}

export {Root, Trigger, Popover}
