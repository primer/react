import {CheckIcon} from '@primer/octicons-react'
import {clsx} from 'clsx'
import {createElement, forwardRef, type ElementType, type HTMLAttributes, type JSX, type PropsWithChildren} from 'react'
import classes from './List.module.css'

type ListProps = PropsWithChildren<{
  as?: ElementType
  showDividers?: boolean
  layout?: 'inline' | 'block'
}> &
  HTMLAttributes<HTMLElement>

const List = forwardRef(function List(
  {as: BaseComponent = 'ul', children, layout = 'inline', showDividers, ...rest}: ListProps,
  ref,
) {
  return createElement(
    BaseComponent,
    {
      ...rest,
      ref,
      class: classes.List,
      'data-dividers': showDividers ? '' : undefined,
      'data-layout': layout,
    },
    children,
  )
})

type ItemProps = PropsWithChildren<
  {
    active?: string
    as?: keyof JSX.IntrinsicElements
    disabled?: boolean
    expanded?: string
    selected?: string
    value?: string
  } & Record<string, unknown>
>

function Item({as: BaseComponent = 'li', children, disabled, ...rest}: ItemProps) {
  return (
    // @ts-expect-error - class works in React 19
    <BaseComponent {...rest} class={classes.Item} aria-disabled={disabled}>
      {children}
    </BaseComponent>
  )
}

type LabelProps = PropsWithChildren

function Label({children}: LabelProps) {
  return <div className={classes.Label}>{children}</div>
}

type DescriptionProps = PropsWithChildren

function Description({children}: DescriptionProps) {
  return <div className={classes.Description}>{children}</div>
}

type LeadingProps = PropsWithChildren

function Leading({children}: LeadingProps) {
  return <div className={classes.Leading}>{children}</div>
}

type TrailingVisualProps = PropsWithChildren

function Trailing({children}: TrailingVisualProps) {
  return <div className={classes.Trailing}>{children}</div>
}

type GroupProps = PropsWithChildren

function Group({children}: GroupProps) {
  return <div className={classes.Group}>{children}</div>
}

type GroupHeadingProps = PropsWithChildren

function GroupHeading({children}: GroupHeadingProps) {
  return <div className={classes.GroupHeading}>{children}</div>
}

type DividerProps = PropsWithChildren

function Divider({children}: DividerProps) {
  return <div className={classes.Divider}>{children}</div>
}

type SelectionProps = HTMLAttributes<HTMLElement> & {
  selected?: boolean
  variant?: 'single' | 'multiple'
}

function Selection({className, selected = true, variant = 'single', ...props}: SelectionProps) {
  return (
    <div
      {...props}
      className={clsx(classes.Selection, className)}
      data-selected={selected ? '' : undefined}
      data-variant={variant}
    >
      {variant === 'multiple' ? (
        <div className={classes.SelectionMultiIcon}>
          <CheckIcon className={classes.SelectionMultiCheckIcon} size={12} />
        </div>
      ) : (
        <CheckIcon className={classes.SelectionSingleIcon} />
      )}
    </div>
  )
}

export {List, Item, Label, Description, Leading, Trailing, Group, GroupHeading, Divider, Selection}
