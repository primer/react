import {clsx} from 'clsx'
import type React from 'react'
import Text from '../Text'
import type {SxProp} from '../sx'
import classes from './FormControlCaption.module.css'
import {useFormControlContext} from './_FormControlContext'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

type FormControlCaptionProps = React.PropsWithChildren<
  {
    id?: string
    className?: string
  } & SxProp
>

function FormControlCaption({id, children, sx, className}: FormControlCaptionProps) {
  const {captionId, disabled} = useFormControlContext()

  return (
    <BoxWithFallback
      as={Text}
      id={id ?? captionId}
      className={clsx(className, classes.Caption)}
      data-control-disabled={disabled ? '' : undefined}
      sx={sx}
    >
      {children}
    </BoxWithFallback>
  )
}

export {FormControlCaption}
