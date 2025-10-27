import type React from 'react'
import {clsx} from 'clsx'
import classNames from './component.module.css'

export const Component: React.FC<React.HTMLProps<HTMLDivElement>> = ({className, ...props}) => {
  return <div className={clsx(classNames.Component, className)} {...props} />
}
