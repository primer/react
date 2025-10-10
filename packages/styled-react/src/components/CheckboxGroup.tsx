import {
  Box,
  CheckboxGroup as PrimerCheckboxGroup,
  type CheckboxGroupProps as PrimerCheckboxGroupProps,
} from '@primer/react'
import React, {type PropsWithChildren} from 'react'
import type {SxProp} from '../sx'

export type CheckboxGroupProps = PropsWithChildren<PrimerCheckboxGroupProps> & SxProp

const CheckboxGroupImpl = (props: CheckboxGroupProps) => {
  return <Box as={PrimerCheckboxGroup} {...props} />
}

// Define local types based on the internal component props
type CheckboxOrRadioGroupLabelProps = PropsWithChildren<
  {
    className?: string
    visuallyHidden?: boolean
  } & SxProp
>
const CheckboxOrRadioGroupLabel = (props: CheckboxOrRadioGroupLabelProps) => {
  return <Box as={PrimerCheckboxGroup.Label} {...props} />
}

type CheckboxOrRadioGroupCaptionProps = PropsWithChildren<
  {
    className?: string
  } & SxProp
>
const CheckboxOrRadioGroupCaption = (props: CheckboxOrRadioGroupCaptionProps) => {
  return <Box as={PrimerCheckboxGroup.Caption} {...props} />
}

type CheckboxOrRadioGroupValidationProps = PropsWithChildren<
  {
    className?: string
    variant: 'error' | 'success'
  } & SxProp
>
const CheckboxOrRadioGroupValidation = (props: CheckboxOrRadioGroupValidationProps) => {
  return <Box as={PrimerCheckboxGroup.Validation} {...props} />
}

export const CheckboxGroup = Object.assign(CheckboxGroupImpl, {
  Label: CheckboxOrRadioGroupLabel,
  Caption: CheckboxOrRadioGroupCaption,
  Validation: CheckboxOrRadioGroupValidation,
})

// @ts-ignore -- TS doesn't know about the __SLOT__ property
CheckboxGroupImpl.__SLOT__ = PrimerCheckboxGroup.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
CheckboxOrRadioGroupLabel.__SLOT__ = PrimerCheckboxGroup.Label.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
CheckboxOrRadioGroupCaption.__SLOT__ = PrimerCheckboxGroup.Caption.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
CheckboxOrRadioGroupValidation.__SLOT__ = PrimerCheckboxGroup.Validation.__SLOT__
