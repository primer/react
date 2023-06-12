import React from 'react'
import merge from 'classnames'
import classNames from './component.module.css'

console.log({classNames})

export const Component: React.FC<React.HTMLProps<HTMLDivElement>> = ({className, ...props}) => {
  return <div className={merge(classNames.component, className)} {...props} />
}
