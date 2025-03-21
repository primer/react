import React from 'react'
import classes from './List.module.css'
import {clsx} from 'clsx'

type DescriptionProps = {
  variant?: 'inline' | 'block'
  className?: string
  truncate?: boolean
  id?: string
  children: React.ReactNode
}

function Description({variant = 'inline', className, id, children}: DescriptionProps) {
  return (
    <span className={clsx(className, classes.Description)} data-variant={variant} id={id}>
      {children}
    </span>
  )
}

export {Description}
export type {DescriptionProps}
