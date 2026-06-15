import {useId, useMemo} from 'react'
import type {ComponentPropsWithoutRef, PropsWithChildren} from 'react'
import {PopoverContext, usePopover} from './PopoverContext'
import classes from './Popover.module.css'

function Root({children}: PropsWithChildren) {
  const popoverId = useId()
  const value = useMemo(() => {
    return {
      popoverId,
    }
  }, [])
  return (
    <div className={classes.Root}>
      <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
    </div>
  )
}

type TriggerProps = ComponentPropsWithoutRef<'button'> & {
  as?: keyof JSX.IntrinsicElements
}

function Trigger({as: BaseComponent = 'button', ...rest}: TriggerProps) {
  const {popoverId} = usePopover()
  return (
    <BaseComponent
      type="button"
      commandfor={popoverId}
      command="toggle-popover"
      className={classes.Trigger}
      {...rest}
    />
  )
}

function Popover(props: ComponentPropsWithoutRef<'div'>) {
  const {popoverId} = usePopover()
  return <div id={popoverId} className={classes.Popover} popover="" {...props} />
}

export {Root, Trigger, Popover}
