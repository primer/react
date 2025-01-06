import React from 'react'
import {Radio, RadioGroup, FormControl, Box} from '..'

export default {
  title: 'Components/RadioGroup/Features',
}

export const VisuallyHiddenLabel = () => (
  <RadioGroup name="defaultRadioGroup">
    <RadioGroup.Label visuallyHidden>Choices</RadioGroup.Label>
    <FormControl>
      <Radio value="one" defaultChecked />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="two" />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </RadioGroup>
)

export const WithExternalLabel = () => (
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
      External label
    </Box>
    <RadioGroup aria-labelledby="choiceHeading" name="defaultRadioGroup">
      <FormControl>
        <Radio value="one" />
        <FormControl.Label>Choice one</FormControl.Label>
      </FormControl>
      <FormControl>
        <Radio value="two" />
        <FormControl.Label>Choice two</FormControl.Label>
      </FormControl>
      <FormControl>
        <Radio value="three" />
        <FormControl.Label>Choice three</FormControl.Label>
      </FormControl>
    </RadioGroup>
  </>
)

export const Error = () => (
  <RadioGroup name="defaultRadioGroup">
    <RadioGroup.Label>Choices</RadioGroup.Label>
    <FormControl>
      <Radio value="one" defaultChecked />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="two" />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
    <RadioGroup.Validation variant="error">Something went wrong</RadioGroup.Validation>
  </RadioGroup>
)

export const Success = () => (
  <RadioGroup name="defaultRadioGroup">
    <RadioGroup.Label>Choices</RadioGroup.Label>
    <FormControl>
      <Radio value="one" />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="two" defaultChecked />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
    <RadioGroup.Validation variant="success">Great job!</RadioGroup.Validation>
  </RadioGroup>
)

export const Caption = () => (
  <RadioGroup name="defaultRadioGroup">
    <RadioGroup.Label>Choices</RadioGroup.Label>
    <RadioGroup.Caption>Caption</RadioGroup.Caption>
    <FormControl>
      <Radio value="one" />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="two" defaultChecked />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </RadioGroup>
)
