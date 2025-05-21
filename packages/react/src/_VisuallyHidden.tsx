import classes from './_VisuallyHidden.module.css'
import {clsx} from 'clsx'
import {BoxWithFallback} from './internal/components/BoxWithFallback'
import type {SxProp} from './sx'

interface Props {
  isVisible?: boolean
  as?: React.ElementType
}

function VisuallyHidden<As extends React.ElementType>({
  isVisible,
  children,
  as = 'span',
  className,
  ...rest
}: Props & { as?: As } & React.ComponentPropsWithoutRef<ElementType extends As ? As : 'span'> & SxProp) {
  return (
    <BoxWithFallback as={as} className={clsx(className, {[classes.InternalVisuallyHidden]: !isVisible})} {...rest}>
      {children}
    </BoxWithFallback>
  )
}

export default VisuallyHidden
