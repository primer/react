import type {ComponentPropsWithoutRef, PropsWithChildren} from 'react'
import * as Popover from './Popover'

function Root({children}: PropsWithChildren) {
  return <Popover.Root>{children}</Popover.Root>
}

function Trigger(props: ComponentPropsWithoutRef<typeof Popover.Trigger>) {
  return <Popover.Trigger {...props} />
}

function Menu({children, ...rest}: ComponentPropsWithoutRef<'div'>) {
  return (
    <Popover.Popover {...rest} role="menu">
      {children}
    </Popover.Popover>
  )
}

function Item(props: ComponentPropsWithoutRef<'div'>) {
  return <div {...props} role="menuitem" />
}

export {Root, Trigger, Menu}
