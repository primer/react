import type React from 'react'
import {clsx} from 'clsx'
import classes from './Pagehead.module.css'

const Pagehead = ({as: BaseComponent = 'div', className, ...rest}: PageheadProps) => {
  return <BaseComponent className={clsx(classes.Pagehead, className)} {...rest} />
}

/**
 * @deprecated
 */
export type PageheadProps = React.ComponentPropsWithoutRef<'div'> & {
  as?: React.ElementType
}
export default Pagehead
