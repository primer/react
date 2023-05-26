import merge from 'classnames'
import React from 'react'
import classNames from './component.module.css'

export const Component: React.FC<React.HTMLProps<HTMLDivElement>> = ({className, ...props}) => {
  return <div className={merge(classNames.component, className)} {...props} />
}
