import {clsx} from 'clsx'
import {Button} from '../internal/components/ButtonReset'
import classes from './TopicTag.module.css'

type TopicTagProps = React.HTMLAttributes<HTMLElement> & {
  className?: string
}

function TopicTag({children, className, ...rest}: TopicTagProps) {
  return (
    <Button {...rest} className={clsx(className, classes.TopicTag)}>
      {children}
    </Button>
  )
}

export {TopicTag}
export type {TopicTagProps}
