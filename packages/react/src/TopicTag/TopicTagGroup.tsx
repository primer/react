import {clsx} from 'clsx'
import type React from 'react'
import classes from './TopicTagGroup.module.css'

type TopicTagGroupProps = React.HTMLAttributes<HTMLElement> & {
  //
}

function TopicTagGroup({children, ...rest}: TopicTagGroupProps) {
  return (
    <div {...rest} className={clsx(classes.TopicTagGroup)}>
      {children}
    </div>
  )
}

export {TopicTagGroup}
export type {TopicTagGroupProps}
