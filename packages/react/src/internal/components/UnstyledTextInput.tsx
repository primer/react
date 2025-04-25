import {type SxProp} from '../../sx'
import React from 'react'

import styles from './UnstyledTextInput.module.css'
import {clsx} from 'clsx'
import {BoxWithFallback} from './BoxWithFallback'

type ToggledUnstyledTextInputProps = React.ComponentPropsWithoutRef<'input'> & SxProp

const UnstyledTextInput = React.forwardRef<HTMLInputElement, ToggledUnstyledTextInputProps>(function UnstyledTextInput(
  {className, ...rest},
  forwardRef,
) {
  return <BoxWithFallback as="input" ref={forwardRef} {...rest} className={clsx(className, styles.Input)} />
})
UnstyledTextInput.displayName = 'UnstyledTextInput'

export default UnstyledTextInput
