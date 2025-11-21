import {clsx} from 'clsx'
import type React from 'react'
import classes from './TopicTagGroup.module.css'

type TopicTagGroupProps = React.HTMLAttributes<HTMLElement>

function TopicTagGroup({children, className, ...rest}: TopicTagGroupProps) {
  return (
    <div {...rest} className={clsx(className, classes.TopicTagGroup)}>
      {children}
    </div>
  )
}

export {TopicTagGroup}
export type {TopicTagGroupProps}
