'use client'

import {KebabHorizontalIcon} from '@primer/octicons-react'
import {Toolbar} from '@base-ui/react/toolbar'
import React from 'react'
import {cn} from '../../internal/cn'
import type {ControlSize} from '../../utils/types'
import {ActionMenu} from '../ActionMenu'
import {Button as SharedButton, type ButtonProps} from '../Button'
import {IconButton as SharedIconButton, type IconButtonProps} from '../IconButton'

export interface ActionBarProps extends React.ComponentPropsWithoutRef<typeof Toolbar.Root> {
  /** Size of the bar's controls. */
  size?: ControlSize
  /** Removes the bar's outer padding so it aligns with surrounding content. */
  flush?: boolean
  /** Spacing between items. */
  gap?: 'none' | 'condensed'
}
const ActionBarContext = React.createContext<ControlSize>('medium')

const Root = React.forwardRef<HTMLDivElement, ActionBarProps>(function ActionBar(
  {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    children,
    className,
    size = 'medium',
    flush = false,
    gap = 'condensed',
    onKeyDown,
    ...props
  },
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
    <ActionBarContext.Provider value={size}>
      <div
        ref={ref}
        data-component="ActionBar"
        data-flush={flush || undefined}
        className={cn('flex items-center justify-end px-4', flush && 'px-0', className)}
      >
        <Toolbar.Root
          {...props}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          data-size={size}
          data-gap={gap}
          onKeyDown={handleKeyDown}
          className={cn(
            'group relative -mb-px flex h-8 min-w-0 items-start overflow-hidden data-[size=small]:h-7 data-[size=large]:h-10',
            gap === 'condensed' && 'gap-2',
          )}
        >
          {children}
        </Toolbar.Root>
      </div>
    </ActionBarContext.Provider>
  )
})

export type ActionBarButtonProps = Omit<ButtonProps, 'data-component' | 'variant'>
const Button = React.forwardRef<HTMLButtonElement, ActionBarButtonProps>(function ActionBarButton(
  {className, ...props},
  ref,
) {
  const size = React.useContext(ActionBarContext)
  return (
    <Toolbar.Button
      {...props}
      ref={ref}
      render={<SharedButton data-component="ActionBar.Button" size={size} variant="invisible" />}
      data-component="ActionBar.Button"
      className={className}
    />
  )
})

export type ActionBarIconButtonProps = Omit<IconButtonProps, 'data-component' | 'variant'>
const IconButton = React.forwardRef<HTMLButtonElement, ActionBarIconButtonProps>(function ActionBarIconButton(
  {className, icon, ...props},
  ref,
) {
  const size = React.useContext(ActionBarContext)
  return (
    <Toolbar.Button
      {...props}
      ref={ref}
      render={
        <SharedIconButton
          aria-label={props['aria-label']}
          data-component="ActionBar.IconButton"
          icon={icon}
          size={size}
          variant="invisible"
        />
      }
      data-component="ActionBar.IconButton"
      className={className}
    />
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
      className={cn('flex gap-[inherit]', className)}
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
  /** Accessible name for the overflow menu trigger. */
  'aria-label': string
  /** Icon rendered on the overflow menu's trigger. */
  icon?: React.ElementType
  /** Items shown in the overflow menu. */
  items: ActionBarMenuItem[]
}
const ActionBarMenu = ({'aria-label': ariaLabel, icon: Icon = KebabHorizontalIcon, items}: ActionBarMenuProps) => {
  const [open, setOpen] = React.useState(false)
  const size = React.useContext(ActionBarContext)
  return (
    <ActionMenu open={open} onOpenChange={setOpen}>
      <Toolbar.Button
        aria-label={ariaLabel}
        render={
          <ActionMenu.Trigger
            render={
              <SharedIconButton
                aria-label={ariaLabel}
                data-component="ActionBar.Menu"
                icon={Icon}
                size={size}
                variant="invisible"
              />
            }
          />
        }
        data-component="ActionBar.Menu"
        onClick={() => setOpen(true)}
      />
      <ActionMenu.Content sideOffset={4} className="min-w-40">
        {items.map(item => (
          <ActionMenu.Item
            key={item.label}
            label={item.label}
            disabled={item.disabled}
            onClick={item.onClick}
            className="min-h-8 rounded-sm py-0 data-[highlighted]:bg-muted"
          >
            {item.label}
          </ActionMenu.Item>
        ))}
      </ActionMenu.Content>
    </ActionMenu>
  )
}

export const ActionBar = Object.assign(Root, {Button, IconButton, Group, Divider, Menu: ActionBarMenu})
Root.displayName = 'ActionBar'
;('use client')
