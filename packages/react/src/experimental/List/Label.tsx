import React from 'react'
import classes from './List.module.css'
import {clsx} from 'clsx'

type LabelProps = {
  className?: string
  truncate?: boolean
  id?: string
  children: React.ReactNode
}

function Label({className, id, children}: LabelProps) {
  return (
    <span className={clsx(className, classes.Label)} id={id}>
      {children}
    </span>
  )
}

Label.displayName = 'Label'

export {Label}
export type {LabelProps}
