import {clsx} from 'clsx'
import type {ElementType} from 'react'
import buttonResetClasses from '../internal/components/ButtonReset.module.css'
import classes from './TopicTag.module.css'

type TopicTagProps<As extends ElementType> = {
  as?: As
  className?: string
} & Omit<React.ComponentPropsWithoutRef<As>, 'as' | 'className'>

function TopicTag<As extends ElementType = 'button'>({as, children, className, ...rest}: TopicTagProps<As>) {
  const BaseComponent = as ?? 'button'
  return (
    <BaseComponent
      {...rest}
      className={clsx(className, classes.TopicTag, {
        [buttonResetClasses.ButtonReset]: BaseComponent === 'button',
      })}
    >
      {children}
    </BaseComponent>
  )
}

export {TopicTag}
export type {TopicTagProps}
