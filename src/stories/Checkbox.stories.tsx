import React, {useRef, useState} from 'react'
import {Meta} from '@storybook/react'
import styled from 'styled-components'

import {BaseStyles, Box, Checkbox, CheckboxProps, Text, ThemeProvider} from '..'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {action} from '@storybook/addon-actions'
import {get} from '../constants'

export default {
  title: 'Forms/Checkbox',
  component: Checkbox,
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Box paddingTop={5}>{Story()}</Box>
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
      name: 'Disabled',
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
  margin-left: 16px;
`

const StyledSubLabel = styled(Text)`
  color: ${get('colors.fg.muted')};
  font-size: 13px;
`

export const Default = ({value: _value, ...args}: CheckboxProps) => {
  const [isChecked, setChecked] = useState<boolean>(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    action('Change event triggered')
  }

  return (
    <>
      <Box as="form" sx={{p: 3, display: 'flex', alignItems: 'flex-start'}}>
        <Checkbox value="default" id="controlled-checkbox" onChange={handleChange} checked={isChecked} {...args} />
        <StyledLabel htmlFor="controlled-checkbox">
          <Text sx={{display: 'block'}}>Default checkbox</Text>
          <StyledSubLabel>controlled</StyledSubLabel>
        </StyledLabel>
      </Box>
      <Box as="form" sx={{p: 3, display: 'flex', alignItems: 'flex-start'}}>
        <Checkbox value="alwaysChecked" id="always-checked-checkbox" checked {...args} />
        <StyledLabel htmlFor="always-checked-checkbox">
          <Text sx={{display: 'block'}}>Always checked</Text>
          <StyledSubLabel>checked=&quot;true&quot;</StyledSubLabel>
        </StyledLabel>
      </Box>
      <Box as="form" sx={{p: 3, display: 'flex', alignItems: 'flex-start'}}>
        <Checkbox value="alwaysUnchecked" id="always-unchecked-checkbox" checked={false} {...args} />
        <StyledLabel htmlFor="always-unchecked-checkbox">
          <Text sx={{display: 'block'}}>Always unchecked</Text>
          <StyledSubLabel>checked=&quot;false&quot;</StyledSubLabel>
        </StyledLabel>
      </Box>
      <Box as="form" sx={{p: 3, display: 'flex', alignItems: 'flex-start'}}>
        <Checkbox value="inactive" id="disabled-checkbox" disabled checked={false} />
        <StyledLabel htmlFor="disabled-checkbox">
          <Text sx={{display: 'block'}}>Inactive</Text>
          <StyledSubLabel>disabled=&quot;true&quot;</StyledSubLabel>
        </StyledLabel>
      </Box>
    </>
  )
}

export const Uncontrolled = ({value: _value, ...args}: CheckboxProps) => {
  const checkboxRef = useRef<HTMLInputElement | null>(null)

  useLayoutEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = true
    }
  }, [])

  return (
    <Box as="form" sx={{p: 3, display: 'flex', alignItems: 'flex-start'}}>
      <Checkbox value="uncontrolled-checkbox" id="uncontrolled-checkbox" ref={checkboxRef} {...args} />
      <StyledLabel htmlFor="uncontrolled-checkbox">
        <Text sx={{display: 'block'}}>Uncontrolled checkbox</Text>
        <StyledSubLabel>Checked by default</StyledSubLabel>
      </StyledLabel>
    </Box>
  )
}

export const Indeterminate = ({value: _value, ...args}: CheckboxProps) => {
  const [checkboxes, setCheckboxes] = useState<boolean[]>([false, false, false, false])

  const handleChange = (_: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newCheckboxes = [...checkboxes]
    newCheckboxes[index] = !checkboxes[index]
    setCheckboxes(newCheckboxes)
  }

  const handleIndeterminateChange = () => {
    if (checkboxes.every(checkbox => checkbox)) {
      return setCheckboxes(checkboxes.map(() => false))
    }

    const newCheckboxes = checkboxes.map(() => true)
    setCheckboxes(newCheckboxes)
  }

  return (
    <>
      <Box as="form" sx={{p: 3, display: 'flex', alignItems: 'flex-start'}}>
        <Checkbox
          value="indeterminate-checkbox"
          id="indeterminate-checkbox"
          checked={checkboxes.every(Boolean)}
          onChange={handleIndeterminateChange}
          indeterminate={!checkboxes.every(Boolean)}
        />
        <StyledLabel htmlFor="controlled-checkbox">
          <Text sx={{display: 'block'}}>Default checkbox</Text>
          <StyledSubLabel>controlled</StyledSubLabel>
        </StyledLabel>
      </Box>

      {checkboxes.map((field, index) => (
        <Box key={`sub-checkbox-${index}`} as="form" sx={{p: 1, pl: 7, display: 'flex', alignItems: 'flex-start'}}>
          <Checkbox
            value={`sub-checkbox-${index}`}
            id={`sub-checkbox-${index}`}
            checked={checkboxes[index]}
            onChange={event => handleChange(event, index)}
            {...args}
          />
          <StyledLabel htmlFor={`sub-checkbox-${index}`}>
            <Text sx={{display: 'block'}}>Checkbox {index + 1}</Text>
          </StyledLabel>
        </Box>
      ))}
    </>
  )
}
