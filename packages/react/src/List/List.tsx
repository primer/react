import {CheckIcon} from '@primer/octicons-react'
import type {PropsWithChildren} from 'react'
import classes from './List.module.css'

type ListProps = PropsWithChildren<{
  showDividers?: boolean
  layout?: 'inline' | 'block'
}>

function List({children, layout = 'inline', showDividers}: ListProps) {
  return (
    <ul className={classes.List} data-dividers={showDividers ? '' : undefined} data-layout={layout}>
      {children}
    </ul>
  )
}

type ItemProps = PropsWithChildren<{}>

function Item({children}: ItemProps) {
  return <li className={classes.Item}>{children}</li>
}

type LabelProps = PropsWithChildren<{}>

function Label({children}: LabelProps) {
  return <div className={classes.Label}>{children}</div>
}

type DescriptionProps = PropsWithChildren<{}>

function Description({children}: DescriptionProps) {
  return <div className={classes.Description}>{children}</div>
}

type LeadingProps = PropsWithChildren<{}>

function Leading({children}: LeadingProps) {
  return <div className={classes.Leading}>{children}</div>
}

type TrailingVisualProps = PropsWithChildren<{}>

function Trailing({children}: TrailingVisualProps) {
  return <div className={classes.Trailing}>{children}</div>
}

type GroupProps = PropsWithChildren<{}>

function Group({children}: GroupProps) {
  return <div className={classes.Group}>{children}</div>
}

type GroupHeadingProps = PropsWithChildren<{}>

function GroupHeading({children}: GroupHeadingProps) {
  return <div className={classes.GroupHeading}>{children}</div>
}

type DividerProps = PropsWithChildren<{}>

function Divider({children}: DividerProps) {
  return <div className={classes.Divider}>{children}</div>
}

type SelectionProps = {}

function Selection(props: SelectionProps) {
  return (
    <div className={classes.Selection}>
      <CheckIcon />
    </div>
  )
}

export {List, Item, Label, Description, Leading, Trailing, Group, GroupHeading, Divider, Selection}
