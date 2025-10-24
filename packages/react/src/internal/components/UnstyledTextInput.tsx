import React from 'react'

import styles from './UnstyledTextInput.module.css'
import {clsx} from 'clsx'

type ToggledUnstyledTextInputProps = React.ComponentPropsWithoutRef<'input'>

const UnstyledTextInput = React.forwardRef<HTMLInputElement, ToggledUnstyledTextInputProps>(function UnstyledTextInput(
  {className, ...rest},
  forwardRef,
) {
  return <input {...rest} ref={forwardRef} className={clsx(className, styles.Input)} />
})
UnstyledTextInput.displayName = 'UnstyledTextInput'

export default UnstyledTextInput
