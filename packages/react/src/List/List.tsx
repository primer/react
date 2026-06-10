import {CheckIcon} from '@primer/octicons-react'
import type {PropsWithChildren} from 'react'
import classes from './List.module.css'

type ListProps = PropsWithChildren<{
  layout?: 'inline' | 'block'
}>

function List({children, layout = 'inline'}: ListProps) {
  return (
    <ul className={classes.List} data-layout={layout}>
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

type LeadingVisualsProps = PropsWithChildren<{}>

function LeadingVisuals({children}: LeadingVisualsProps) {
  return <div className={classes.LeadingVisuals}>{children}</div>
}

type TrailingVisualProps = PropsWithChildren<{}>

function TrailingVisuals({children}: TrailingVisualProps) {
  return <div className={classes.TrailingVisuals}>{children}</div>
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

export {List, Item, Label, Description, LeadingVisuals, TrailingVisuals, Group, GroupHeading, Divider, Selection}
