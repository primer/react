import React, {ChangeEventHandler} from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, Box, Checkbox, FormControl, Radio, ThemeProvider} from '..'
import ChoiceGroup from '../ChoiceGroup'
import {ComponentProps} from '../utils/types'
import {useState} from '@storybook/addons'

type Args = ComponentProps<typeof ChoiceGroup>

export default {
  title: 'Forms/ChoiceGroup',
  component: ChoiceGroup,
  argTypes: {
    disabled: {
      defaultValue: false
    },
    required: {
      defaultValue: false
    }
  },
  parameters: {controls: {exclude: ['id', 'validationMap', 'validationResult', 'name', 'onSelect']}},
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ]
} as Meta

export const RadioChoiceGroup = (args: Args) => (
  <ChoiceGroup {...args}>
    <ChoiceGroup.Label>Choices</ChoiceGroup.Label>
    <FormControl>
      <Radio name="radioInput" value="choiceOne" />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio name="radioInput" value="choiceTwo" />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio name="radioInput" value="choiceThree" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </ChoiceGroup>
)
RadioChoiceGroup.storyName = 'Radio group (default)'

export const CheckboxChoiceGroup = (args: Args) => (
  <ChoiceGroup {...args}>
    <ChoiceGroup.Label>Choices</ChoiceGroup.Label>
    <FormControl>
      <Checkbox />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </ChoiceGroup>
)
CheckboxChoiceGroup.parameters = {controls: {exclude: ['id', 'selectionVariant']}}
CheckboxChoiceGroup.storyName = 'Checkbox group'

export const WithCaption = (args: Args) => (
  <ChoiceGroup {...args}>
    <ChoiceGroup.Label>Choices</ChoiceGroup.Label>
    <ChoiceGroup.Caption>You can pick any or all of these choices</ChoiceGroup.Caption>
    <FormControl>
      <Checkbox />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </ChoiceGroup>
)

export const WithExternalLabel = (args: Args) => (
  <>
    <Box
      id="choiceHeading"
      borderBottomWidth="1px"
      borderBottomStyle="solid"
      borderBottomColor="border.default"
      pb={2}
      mb={3}
      fontSize={3}
    >
      Choices
    </Box>
    <ChoiceGroup aria-labelledby="choiceHeading" {...args}>
      <FormControl>
        <Checkbox />
        <FormControl.Label>Choice one</FormControl.Label>
      </FormControl>
      <FormControl>
        <Checkbox />
        <FormControl.Label>Choice two</FormControl.Label>
      </FormControl>
      <FormControl>
        <Checkbox />
        <FormControl.Label>Choice three</FormControl.Label>
      </FormControl>
    </ChoiceGroup>
  </>
)

export const WithHiddenLabel = (args: Args) => (
  <ChoiceGroup {...args}>
    <ChoiceGroup.Label visuallyHidden>Choices</ChoiceGroup.Label>
    <FormControl>
      <Checkbox />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </ChoiceGroup>
)

export const WithValidation = (args: Args) => (
  <ChoiceGroup {...args}>
    <ChoiceGroup.Label>Choices</ChoiceGroup.Label>
    <FormControl>
      <Checkbox />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
    <ChoiceGroup.Validation variant="error">Your choices are wrong</ChoiceGroup.Validation>
  </ChoiceGroup>
)

export const WithOnChangeHandlers = (args: Args) => {
  const [selectedCheckboxValues, setSelectedCheckboxValues] = useState<string[]>([])
  const [selectedRadioValue, setSelectedRadioValue] = useState<string>('')

  const handleCheckboxChange: ChangeEventHandler<HTMLInputElement> = e => {
    const {value, checked} = e.currentTarget

    if (checked) {
      setSelectedCheckboxValues([...selectedCheckboxValues, value])
      return
    }

    setSelectedCheckboxValues(selectedCheckboxValues.filter(selectedValue => selectedValue !== value))
  }

  const handleRadioChange: ChangeEventHandler<HTMLInputElement> = e => {
    const {value, checked} = e.currentTarget

    if (checked) {
      setSelectedRadioValue(value)
    }
  }

  return (
    <Box display="grid" sx={{gap: 3}}>
      <Box display="grid" sx={{gap: 1}}>
        <ChoiceGroup {...args}>
          <ChoiceGroup.Label>Checkboxes</ChoiceGroup.Label>
          <FormControl>
            <Checkbox value="checkOne" onChange={handleCheckboxChange} />
            <FormControl.Label>Checkbox one</FormControl.Label>
          </FormControl>
          <FormControl>
            <Checkbox value="checkTwo" onChange={handleCheckboxChange} />
            <FormControl.Label>Checkbox two</FormControl.Label>
          </FormControl>
          <FormControl>
            <Checkbox value="checkThree" onChange={handleCheckboxChange} />
            <FormControl.Label>Checkbox three</FormControl.Label>
          </FormControl>
        </ChoiceGroup>

        {Boolean(selectedCheckboxValues.length) && (
          <div>The selected checkbox values are {selectedCheckboxValues.join(', ')}</div>
        )}
      </Box>

      <Box display="grid" sx={{gap: 1}}>
        <ChoiceGroup {...args}>
          <ChoiceGroup.Label>Radios</ChoiceGroup.Label>
          <FormControl>
            <Radio name="radioChoices" value="radioOne" onChange={handleRadioChange} />
            <FormControl.Label>Radio one</FormControl.Label>
          </FormControl>
          <FormControl>
            <Radio name="radioChoices" value="radioTwo" onChange={handleRadioChange} />
            <FormControl.Label>Radio two</FormControl.Label>
          </FormControl>
          <FormControl>
            <Radio name="radioChoices" value="radioThree" onChange={handleRadioChange} />
            <FormControl.Label>Radio three</FormControl.Label>
          </FormControl>
        </ChoiceGroup>

        {selectedRadioValue && <div>The selected radio value is {selectedRadioValue}</div>}
      </Box>
    </Box>
  )
}
