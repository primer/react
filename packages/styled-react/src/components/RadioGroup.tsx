import {Box, RadioGroup as PrimerRadioGroup, type RadioGroupProps as PrimerRadioGroupProps} from '@primer/react'
import React, {type PropsWithChildren} from 'react'
import type {SxProp} from '../sx'

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

// @ts-ignore -- TS doesn't know about the __SLOT__ property
RadioGroupImpl.__SLOT__ = PrimerRadioGroup.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
CheckboxOrRadioGroupLabel.__SLOT__ = PrimerRadioGroup.Label.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
CheckboxOrRadioGroupCaption.__SLOT__ = PrimerRadioGroup.Caption.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
CheckboxOrRadioGroupValidation.__SLOT__ = PrimerRadioGroup.Validation.__SLOT__
