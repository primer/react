import {CheckIcon} from '@primer/octicons-react'
import {forwardRef, type JSX, type PropsWithChildren} from 'react'
import classes from './List.module.css'

type ListProps = PropsWithChildren<{
  as?: keyof JSX.IntrinsicElements
  showDividers?: boolean
  layout?: 'inline' | 'block'
}>

const List = forwardRef(function List(
  {as: BaseComponent = 'ul', children, layout = 'inline', showDividers}: ListProps,
  ref,
) {
  return (
    // @ts-expect-error - class works in React 19
    <BaseComponent ref={ref} class={classes.List} data-dividers={showDividers ? '' : undefined} data-layout={layout}>
      {children}
    </BaseComponent>
  )
})

type ItemProps = PropsWithChildren<{
  as?: keyof JSX.IntrinsicElements
  disabled?: boolean
}>

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

type SelectionProps = React.HTMLAttributes<HTMLElement>

function Selection(props: SelectionProps) {
  return (
    <div {...props} className={classes.Selection}>
      <CheckIcon />
    </div>
  )
}

export {List, Item, Label, Description, Leading, Trailing, Group, GroupHeading, Divider, Selection}
