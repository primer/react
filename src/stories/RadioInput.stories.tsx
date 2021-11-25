import React, {ChangeEvent, useState} from 'react'
import {Meta} from '@storybook/react'
import styled from 'styled-components'

import {BaseStyles, Box, RadioInput, RadioInputProps, Text, ThemeProvider} from '..'
import {COMMON, get} from '../constants'

export default {
  title: 'Forms/Radio Input',
  component: RadioInput,
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Box sx={{pt: 3}}>{Story()}</Box>
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  argTypes: {
    sx: {
      table: {
        disable: true
      }
    },
    disabled: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    checked: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    }
  }
} as Meta

const StyledLabel = styled.label`
  user-select: none;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  margin-left: 8px;
  display: flex;
  cursor: pointer;

  &:first-child {
    margin-left: 0;
  }

  &[aria-disabled='true'] {
    pointer-events: none;
    cursor: not-allowed;
    color: ${get('colors.primer.fg.disabled')};
  }
  ${COMMON}
`

export const Default = ({disabled, checked}: RadioInputProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked || false)
  const handleChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <>
      <Box as="form" p={3} sx={{display: 'flex', alignItems: 'flex-start'}}>
        <RadioInput
          id="controlled-radio"
          value="Mona"
          name="Octocats"
          disabled={disabled}
          checked={isChecked}
          onChange={handleChange}
        />
        <StyledLabel htmlFor="controlled-radio" aria-disabled={disabled}>
          <Text sx={{display: 'block'}}>Default radio</Text>
        </StyledLabel>
      </Box>
    </>
  )
}

export const MultipleRadios = ({disabled}: RadioInputProps) => {
  const [activeOctocat, setActiveOctocat] = useState<'Mona' | 'Ironcat' | undefined>()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target.value as 'Mona' | 'Ironcat'
    setActiveOctocat(target)
  }

  return (
    <>
      <Box as="form" p={3} sx={{display: 'inline-flex', alignItems: 'flex-start'}}>
        <StyledLabel htmlFor="mona-radio" aria-disabled={disabled}>
          <RadioInput
            id="mona-radio"
            onChange={handleChange}
            checked={activeOctocat === 'Mona'}
            value="Mona"
            name="Octocats"
            disabled={disabled}
          />
          <Text sx={{marginLeft: 2}}>Mona</Text>
        </StyledLabel>
      </Box>
      <Box as="form" p={3} sx={{display: 'inline-flex', alignItems: 'flex-start'}}>
        <StyledLabel htmlFor="ironcat-radio" aria-disabled={disabled}>
          <RadioInput
            id="ironcat-radio"
            onChange={handleChange}
            checked={activeOctocat === 'Ironcat'}
            value="Ironcat"
            name="Octocats"
            disabled={disabled}
          />
          <Text sx={{marginLeft: 2}}>Ironcat</Text>
        </StyledLabel>
      </Box>
    </>
  )
}
