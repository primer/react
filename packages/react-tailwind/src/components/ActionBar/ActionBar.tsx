import {KebabHorizontalIcon} from '@primer/octicons-react'
import {Menu} from '@base-ui/react/menu'
import {Toolbar} from '@base-ui/react/toolbar'
import React from 'react'
import {cn} from '../../internal/cn'
import {ButtonBase} from '../Button'

const actionClassName =
  'inline-flex min-h-8 appearance-none items-center justify-center gap-2 rounded-md bg-transparent px-2 text-sm font-semibold text-accent hover:bg-accent-muted focus-visible:outline-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:text-disabled'

export interface ActionBarProps extends React.ComponentPropsWithoutRef<typeof Toolbar.Root> {
  size?: 'small' | 'medium' | 'large'
  flush?: boolean
  gap?: 'none' | 'condensed'
}
const Root = React.forwardRef<HTMLDivElement, ActionBarProps>(function ActionBar(
  {className, size = 'medium', flush = false, gap = 'condensed', onKeyDown, ...props},
  ref,
) {
  const handleKeyDown: NonNullable<ActionBarProps['onKeyDown']> = event => {
    onKeyDown?.(event)
    if (event.defaultPrevented || (event.key !== 'Home' && event.key !== 'End')) return
    const actions = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[data-focusable]:not([data-disabled])'),
    )
    const action = event.key === 'Home' ? actions[0] : actions.at(-1)
    if (action) {
      event.preventDefault()
      action.focus()
    }
  }
  return (
    <Toolbar.Root
      {...props}
      ref={ref}
      data-component="ActionBar"
      data-size={size}
      data-flush={flush || undefined}
      data-gap={gap}
      onKeyDown={handleKeyDown}
      className={cn(
        'group relative -mb-px flex h-8 items-start justify-end overflow-hidden px-4 data-[size=small]:h-7 data-[size=large]:h-10',
        flush && 'px-0',
        gap === 'condensed' && 'gap-2',
        className,
      )}
    />
  )
})

export type ActionBarButtonProps = React.ComponentPropsWithoutRef<typeof Toolbar.Button>
const Button = React.forwardRef<HTMLButtonElement, ActionBarButtonProps>(function ActionBarButton(
  {className, ...props},
  ref,
) {
  return (
    <Toolbar.Button
      {...props}
      ref={ref}
      render={<ButtonBase />}
      data-component="ActionBar.Button"
      className={cn(
        actionClassName,
        'group-data-[size=small]:min-h-7 group-data-[size=small]:px-1.5 group-data-[size=large]:min-h-10 group-data-[size=large]:px-3',
        className,
      )}
    />
  )
})

export interface ActionBarIconButtonProps extends Omit<ActionBarButtonProps, 'children'> {
  icon: React.ElementType
  'aria-label': string
}
const IconButton = React.forwardRef<HTMLButtonElement, ActionBarIconButtonProps>(function ActionBarIconButton(
  {icon: Icon, ...props},
  ref,
) {
  return (
    <Button {...props} ref={ref} data-component="ActionBar.IconButton">
      <Icon aria-hidden="true" />
    </Button>
  )
})

export type ActionBarGroupProps = React.ComponentPropsWithoutRef<typeof Toolbar.Group>
const Group = React.forwardRef<HTMLDivElement, ActionBarGroupProps>(function ActionBarGroup(
  {className, ...props},
  ref,
) {
  return (
    <Toolbar.Group
      {...props}
      ref={ref}
      data-component="ActionBar.Group"
      className={cn('flex items-center gap-1', className)}
    />
  )
})

export type ActionBarDividerProps = React.ComponentPropsWithoutRef<typeof Toolbar.Separator>
const Divider = React.forwardRef<HTMLDivElement, ActionBarDividerProps>(function ActionBarDivider(
  {className, ...props},
  ref,
) {
  return (
    <Toolbar.Separator
      {...props}
      ref={ref}
      data-component="ActionBar.Divider"
      className={cn('h-5 w-px bg-muted', className)}
    />
  )
})

export interface ActionBarMenuItem {
  label: string
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
}
export interface ActionBarMenuProps {
  'aria-label': string
  icon?: React.ElementType
  items: ActionBarMenuItem[]
}
const ActionBarMenu = ({'aria-label': ariaLabel, icon: Icon = KebabHorizontalIcon, items}: ActionBarMenuProps) => {
  const [open, setOpen] = React.useState(false)
  return (
    <Menu.Root open={open} onOpenChange={setOpen}>
      <Toolbar.Button
        aria-label={ariaLabel}
        render={<Menu.Trigger />}
        data-component="ActionBar.Menu"
        onClick={() => setOpen(true)}
        className={cn(
          actionClassName,
          'group-data-[size=small]:min-h-7 group-data-[size=small]:px-1.5 group-data-[size=large]:min-h-10 group-data-[size=large]:px-3',
        )}
      >
        <Icon aria-hidden="true" />
      </Toolbar.Button>
      <Menu.Portal>
        <Menu.Positioner sideOffset={4}>
          <Menu.Popup className="z-popover min-w-40 rounded-md border border-default bg-default p-1 shadow-floating-lg">
            {items.map(item => (
              <Menu.Item
                key={item.label}
                label={item.label}
                disabled={item.disabled}
                onClick={item.onClick}
                className="flex min-h-8 w-full items-center rounded-sm px-2 text-sm text-default data-[highlighted]:bg-muted data-[disabled]:text-disabled"
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

export const ActionBar = Object.assign(Root, {Button, IconButton, Group, Divider, Menu: ActionBarMenu})
Root.displayName = 'ActionBar'
