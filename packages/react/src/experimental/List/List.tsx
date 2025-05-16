import React from 'react'
import {clsx} from 'clsx'
import classes from './List.module.css'

type ListVariant = 'inset' | 'full'

type ListProps = {
  className?: string
  showDividers?: boolean
  variant?: ListVariant
  children: React.ReactNode
}

function List({className, showDividers, variant, children, ...props}: ListProps) {
  return (
    <ul
      className={clsx(classes.List, className)}
      data-dividers={showDividers ? '' : undefined}
      data-variant={variant}
      {...props}
    >
      {children}
    </ul>
  )
}

List.displayName = 'List'

export {List}
export type {ListProps}
