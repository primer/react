import classes from './_VisuallyHidden.module.css'
import {clsx} from 'clsx'
import {BoxWithFallback} from './internal/components/BoxWithFallback'
import type {SxProp} from './sx'

interface Props extends React.ComponentPropsWithoutRef<'span'> {
  isVisible?: boolean
  as?: React.ElementType
}

function VisuallyHidden({isVisible, children, as = 'span', className, ...rest}: Props & SxProp) {
  return (
    <BoxWithFallback as={as} className={clsx(className, {[classes.InternalVisuallyHidden]: !isVisible})} {...rest}>
      {children}
    </BoxWithFallback>
  )
}

export default VisuallyHidden
