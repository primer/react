import classes from './_VisuallyHidden.module.css'
import {clsx} from 'clsx'
import {BoxWithFallback} from './internal/components/BoxWithFallback'
import type {SxProp} from './sx'

interface Props {
  isVisible?: boolean
  as?: React.ElementType
}

function VisuallyHidden({
  isVisible,
  children,
  as = 'span',
  ...rest
}: Props & React.HTMLAttributes<HTMLSpanElement> & SxProp) {
  return (
    <BoxWithFallback as={as} className={clsx({[classes.InternalVisuallyHidden]: !isVisible})} {...rest}>
      {children}
    </BoxWithFallback>
  )
}

export default VisuallyHidden
