import {clsx} from 'clsx'
import type React from 'react'
import Text from '../Text'
import classes from './FormControlCaption.module.css'
import {useFormControlContext} from './_FormControlContext'

export type FormControlCaptionProps = React.PropsWithChildren<{
  id?: string
  className?: string
}>

function FormControlCaption({id, children, className}: FormControlCaptionProps) {
  const {captionId, disabled} = useFormControlContext()

  return (
    <Text
      id={id ?? captionId}
      className={clsx(className, classes.Caption)}
      data-control-disabled={disabled ? '' : undefined}
    >
      {children}
    </Text>
  )
}

export {FormControlCaption}
