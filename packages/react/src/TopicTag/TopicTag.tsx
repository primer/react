import {clsx} from 'clsx'
import type {ElementType} from 'react'
import classes from './TopicTag.module.css'

type TopicTagProps<As extends ElementType> = {
  /**
   * The HTML element or React component to render as the root element
   */
  as?: As

  /**
   * Provide a class name for styling on the outermost element
   */
  className?: string
} & Omit<React.ComponentPropsWithoutRef<As>, 'as' | 'className'>

function TopicTag<As extends ElementType = 'a'>({as, children, className, ...rest}: TopicTagProps<As>) {
  const BaseComponent = as ?? 'a'
  return (
    <BaseComponent {...rest} className={clsx(className, classes.TopicTag)}>
      {children}
    </BaseComponent>
  )
}

export {TopicTag}
export type {TopicTagProps}
