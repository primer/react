import {RadioGroup as PrimerRadioGroup, type RadioGroupProps as PrimerRadioGroupProps} from '@primer/react'
import React, {type PropsWithChildren} from 'react'
import type {SxProp} from '../sx'
import Box from './Box'

export type RadioGroupProps = PropsWithChildren<PrimerRadioGroupProps> & SxProp

const RadioGroupImpl = (props: RadioGroupProps) => {
  return <Box as={PrimerRadioGroup} {...props} />
}

// Define local types based on the internal component props
type CheckboxOrRadioGroupLabelProps = PropsWithChildren<
  {
    className?: string
    visuallyHidden?: boolean
  } & SxProp
>
const CheckboxOrRadioGroupLabel = (props: CheckboxOrRadioGroupLabelProps) => {
  return <Box as={PrimerRadioGroup.Label} {...props} />
}

type CheckboxOrRadioGroupCaptionProps = PropsWithChildren<
  {
    className?: string
  } & SxProp
>
const CheckboxOrRadioGroupCaption = (props: CheckboxOrRadioGroupCaptionProps) => {
  return <Box as={PrimerRadioGroup.Caption} {...props} />
}

type CheckboxOrRadioGroupValidationProps = PropsWithChildren<
  {
    className?: string
    variant: 'error' | 'success'
  } & SxProp
>
const CheckboxOrRadioGroupValidation = (props: CheckboxOrRadioGroupValidationProps) => {
  return <Box as={PrimerRadioGroup.Validation} {...props} />
}

export const RadioGroup = Object.assign(RadioGroupImpl, {
  Label: CheckboxOrRadioGroupLabel,
  Caption: CheckboxOrRadioGroupCaption,
  Validation: CheckboxOrRadioGroupValidation,
})

RadioGroupImpl.__SLOT__ = PrimerRadioGroup.__SLOT__
CheckboxOrRadioGroupLabel.__SLOT__ = PrimerRadioGroup.Label.__SLOT__
CheckboxOrRadioGroupCaption.__SLOT__ = PrimerRadioGroup.Caption.__SLOT__
CheckboxOrRadioGroupValidation.__SLOT__ = PrimerRadioGroup.Validation.__SLOT__
