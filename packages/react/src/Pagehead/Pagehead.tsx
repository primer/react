import React from 'react'
import {clsx} from 'clsx'
import {type SxProp} from '../sx'
import classes from './Pagehead.module.css'
import {defaultSxProp} from '../utils/defaultSxProp'
import Box from '../Box'

const Pagehead = ({className, sx: sxProp = defaultSxProp, ...rest}: PageheadProps) => {
  if (sxProp !== defaultSxProp || rest.as) {
    return <Box sx={sxProp} className={clsx(classes.Pagehead, className)} {...rest} />
  }
  return <div className={clsx(classes.Pagehead, className)} {...rest} />
}

/**
 * @deprecated
 */
export type PageheadProps = SxProp &
  React.ComponentPropsWithoutRef<'div'> & {
    as?: React.ElementType
  }
export default Pagehead
