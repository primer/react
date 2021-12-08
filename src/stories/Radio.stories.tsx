import React, {ChangeEvent, useState} from 'react'
import {Meta} from '@storybook/react'
import styled from 'styled-components'

import {BaseStyles, Box, Radio, RadioProps, Text, ThemeProvider} from '..'
import {get} from '../constants'

export default {
  title: 'Forms/Radio',
  component: Radio,
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
`

export const Default = ({disabled, checked}: RadioProps) => {
  const [isSelected, setSelected] = useState<boolean>(checked || false)
  const handleChange = () => {
    setSelected(!isSelected)
  }

  return (
    <>
      <Box as="form" p={3} sx={{display: 'flex', alignItems: 'flex-start'}}>
        <Radio
          id="default-radio"
          value="default"
          name="default"
          disabled={disabled}
          checked={isSelected}
          onChange={handleChange}
        />
        <StyledLabel htmlFor="default-radio" aria-disabled={disabled}>
          Default radio button
        </StyledLabel>
      </Box>
    </>
  )
}

export const MultipleRadios = ({disabled}: RadioProps) => {
  const [activeSelection, setActiveSelection] = useState<'yes' | 'no' | undefined>()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target.value as 'yes' | 'no'
    setActiveSelection(target)
  }

  return (
    <>
      <Box as="form" p={3} sx={{display: 'inline-flex', alignItems: 'flex-start'}}>
        <StyledLabel htmlFor="yes-radio" aria-disabled={disabled}>
          <Radio
            id="yes-radio"
            onChange={handleChange}
            checked={activeSelection === 'yes'}
            value="yes"
            name="Choice"
            disabled={disabled}
          />
          <Text sx={{marginLeft: 2}}>Yes</Text>
        </StyledLabel>
      </Box>
      <Box as="form" p={3} sx={{display: 'inline-flex', alignItems: 'flex-start'}}>
        <StyledLabel htmlFor="no-radio" aria-disabled={disabled}>
          <Radio
            id="no-radio"
            onChange={handleChange}
            checked={activeSelection === 'no'}
            value="no"
            name="Choice"
            disabled={disabled}
          />
          <Text sx={{marginLeft: 2}}>No</Text>
        </StyledLabel>
      </Box>
    </>
  )
}
