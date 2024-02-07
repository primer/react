import React from 'react'
import {Checkbox, CheckboxGroup, FormControl, Box} from '..'

export default {
  title: 'Components/CheckboxGroup/Features',
}

export const VisuallyHiddenLabel = () => (
  <CheckboxGroup>
    <CheckboxGroup.Label visuallyHidden>Choices</CheckboxGroup.Label>
    <FormControl>
      <Checkbox value="one" defaultChecked />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="two" defaultChecked />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </CheckboxGroup>
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
    <CheckboxGroup aria-labelledby="choiceHeading">
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
    </CheckboxGroup>
  </>
)

export const Error = () => (
  <CheckboxGroup>
    <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
    <FormControl>
      <Checkbox value="one" defaultChecked />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="two" defaultChecked />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
    <CheckboxGroup.Validation variant="error">Something went wrong</CheckboxGroup.Validation>
  </CheckboxGroup>
)

export const Success = () => (
  <CheckboxGroup>
    <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
    <FormControl>
      <Checkbox value="one" defaultChecked />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="two" defaultChecked />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
    <CheckboxGroup.Validation variant="success">Great job!</CheckboxGroup.Validation>
  </CheckboxGroup>
)

export const Caption = () => (
  <CheckboxGroup>
    <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
    <CheckboxGroup.Caption>Caption</CheckboxGroup.Caption>
    <FormControl>
      <Checkbox value="one" defaultChecked />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="two" defaultChecked />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </CheckboxGroup>
)
