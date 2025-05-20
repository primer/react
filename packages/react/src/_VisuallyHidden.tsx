import classes from './_VisuallyHidden.module.css'
import {clsx} from 'clsx'

interface Props {
  isVisible?: boolean
}

function VisuallyHidden({isVisible, children, ...rest}: Props & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={clsx({[classes.InternalVisuallyHidden]: !isVisible})} {...rest}>
      {children}
    </span>
  )
}

export default VisuallyHidden
