import type React from 'react'
import {clsx} from 'clsx'
import {type SxProp} from '../sx'
import classes from './Pagehead.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

const Pagehead = ({className, ...rest}: PageheadProps) => {
  return <BoxWithFallback className={clsx(classes.Pagehead, className)} {...rest} />
}

/**
 * @deprecated
 */
export type PageheadProps = SxProp &
  React.ComponentPropsWithoutRef<'div'> & {
    as?: React.ElementType
  }
export default Pagehead
