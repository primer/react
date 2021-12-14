import React, {HTMLAttributes, ComponentPropsWithRef} from 'react'
import styled from 'styled-components'
import TextInputWrapper from '../_TextInputWrapper'
import UnstyledSelectInput from './_UnstyledSelectInput'
import {SxProp} from '../sx'
import {TriangleDownIcon, TriangleUpIcon} from '@primer/octicons-react'

const SelectCaret = styled.span`
  display: grid;
  grid-template-rows: 1fr 1fr;
`

export type SelectInputProps = {
  disabled?: boolean
  selectedValue?: string | undefined
  children: React.ReactNode
  size?: 'small' | 'large'
} & SxProp &
  HTMLAttributes<HTMLButtonElement> &
  ComponentPropsWithRef<typeof UnstyledSelectInput>

type OptionProps = {children: string; value: string | undefined}

const OptionComponent = (props: OptionProps) => {
  return <option>{props.children}</option>
}

const SelectInputComponent = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({sx, size, selectedValue, children, ...props}: SelectInputProps, ref) => {
    return (
      <TextInputWrapper disabled={props.disabled} sx={sx} variant={size}>
        <UnstyledSelectInput ref={ref} value={selectedValue} {...props}>
          {children}
        </UnstyledSelectInput>
        <SelectCaret>
          <TriangleUpIcon />
          <TriangleDownIcon />
        </SelectCaret>
      </TextInputWrapper>
    )
  }
)

const SelectInput = Object.assign(SelectInputComponent, {Option: OptionComponent})

export {SelectInput}
