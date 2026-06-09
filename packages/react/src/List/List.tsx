import type {PropsWithChildren} from 'react'
import classes from './List.module.css'

type ListProps = PropsWithChildren<{}>

function List({children}: ListProps) {
  return <ul className={classes.List}>{children}</ul>
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

export {List, Item, Label, LeadingVisuals, TrailingVisuals}
