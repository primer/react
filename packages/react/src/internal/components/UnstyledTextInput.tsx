import styled from 'styled-components'
import sx, {type SxProp} from '../../sx'
import {toggleStyledComponent} from '../utils/toggleStyledComponent'
import React from 'react'
import {useFeatureFlag} from '../../FeatureFlags'

import styles from './UnstyledTextInput.module.css'
import {clsx} from 'clsx'

export const TEXT_INPUT_CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_ga'

type ToggledUnstyledTextInputProps = React.ComponentPropsWithoutRef<'input'> & SxProp

const ToggledUnstyledTextInput = toggleStyledComponent(
  TEXT_INPUT_CSS_MODULES_FEATURE_FLAG,
  'input',
  styled.input`
    border: 0;
    font-size: inherit;
    font-family: inherit;
    background-color: transparent;
    -webkit-appearance: none;
    color: inherit;
    width: 100%;
    &:focus {
      outline: 0;
    }

    ${sx};
  `,
)

const UnstyledTextInput = React.forwardRef<HTMLInputElement, ToggledUnstyledTextInputProps>(function UnstyledTextInput(
  {className, ...rest},
  forwardRef,
) {
  const enabled = useFeatureFlag(TEXT_INPUT_CSS_MODULES_FEATURE_FLAG)
  return <ToggledUnstyledTextInput ref={forwardRef} {...rest} className={clsx(className, enabled && styles.Input)} />
})
UnstyledTextInput.displayName = 'UnstyledTextInput'

export default UnstyledTextInput
