import type React from 'react'
import {clsx} from 'clsx'
import classes from './Pagehead.module.css'
import {mergeProps} from '../utils/mergeProps'

const Pagehead = ({as: BaseComponent = 'div', className, ...rest}: PageheadProps) => {
  return (
    <BaseComponent
      {...mergeProps(
        {
          className: clsx(classes.Pagehead, className),
          'data-component': 'Pagehead',
        },
        rest,
      )}
    />
  )
}

/**
 * @deprecated
 */
export type PageheadProps = React.ComponentPropsWithoutRef<'div'> & {
  as?: React.ElementType
}
export default Pagehead
