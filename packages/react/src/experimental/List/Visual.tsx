import React from 'react'
import classes from './List.module.css'
import {clsx} from 'clsx'

type VisualProps = {
  className?: string
  children: React.ReactNode
  // type: 'leading' | 'trailing'
}

// function Visual({className, children, type}: VisualProps) {
//   return (
//     <span className={clsx(className, classes.Visual)} data-type={type}>
//       {children}
//     </span>
//   )
// }

function LeadingVisual({className, children}: VisualProps) {
  return <span className={clsx(className, classes.Visual, classes.LeadingVisual)}>{children}</span>
}

function TrailingVisual({className, children}: VisualProps) {
  return <span className={clsx(className, classes.Visual, classes.LeadingVisual)}>{children}</span>
}

export {LeadingVisual, TrailingVisual}
export type {VisualProps}
