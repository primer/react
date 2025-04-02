import {clsx} from 'clsx'
import React from 'react'
import Text from '../Text'
import type {SxProp} from '../sx'
import classes from './FormControlCaption.module.css'
import {useFormControlContext} from './_FormControlContext'
import {toggleSxComponent} from '../internal/utils/toggleSxComponent'

type FormControlCaptionProps = React.PropsWithChildren<
  {
    id?: string
    className?: string
  } & SxProp
>

const Caption = toggleSxComponent({}, Text) as React.ComponentType<FormControlCaptionProps>

function FormControlCaption({id, children, sx, className}: FormControlCaptionProps) {
  const {captionId, disabled} = useFormControlContext()

  return (
    <Caption
      id={id ?? captionId}
      className={clsx(className, classes.Caption)}
      data-control-disabled={disabled ? '' : undefined}
      sx={sx}
    >
      {children}
    </Caption>
  )
}

export {FormControlCaption}
