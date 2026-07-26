import {MarkGithubIcon} from '@primer/octicons-react'
import type {StoryObj} from '@storybook/react-vite'
import {Autocomplete} from '../Autocomplete'
import {Checkbox} from '../Checkbox'
import {CheckboxGroup} from '../CheckboxGroup'
import {Radio} from '../Radio'
import {RadioGroup} from '../RadioGroup'
import {Select} from '../Select'
import {Stack} from '../Stack'
import {Text} from '../Text'
import {TextInput} from '../TextInput'
import {Textarea} from '../Textarea'
import {FormControl} from './FormControl'
import {formControlTokens, TokenInputFixture} from './FormControl.stories.helpers'

export default {title: 'React Tailwind/Forms/FormControl/Features', component: FormControl}
type Story = StoryObj
type SingleInputStory = StoryObj<{
  caption: string
  disabled: boolean
  label: string
  required: boolean
}>

export const WithComplexInputs: Story = {
  render: () => (
    <Stack gap="none">
      <FormControl>
        <FormControl.Label>TextInputWithTokens</FormControl.Label>
        <TokenInputFixture initialTokens={formControlTokens} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Autocomplete</FormControl.Label>
        <Autocomplete items={['css', 'javascript', 'react']}>
          <Autocomplete.Input />
        </Autocomplete>
      </FormControl>
      <FormControl>
        <FormControl.Label>Select</FormControl.Label>
        <Select defaultValue="figma">
          <Select.Option value="figma">Figma</Select.Option>
          <Select.Option value="css">Primer CSS</Select.Option>
          <Select.Option value="prc">Primer React components</Select.Option>
          <Select.Option value="pvc">Primer ViewComponents</Select.Option>
        </Select>
      </FormControl>
      <FormControl>
        <FormControl.Label>Textarea</FormControl.Label>
        <Textarea />
      </FormControl>
    </Stack>
  ),
}
export const WithCheckboxAndRadioInputs: Story = {
  render: () => (
    <div className="grid gap-4">
      <CheckboxGroup>
        <CheckboxGroup.Label>Checkboxes</CheckboxGroup.Label>
        {['one', 'two', 'three'].map(value => (
          <FormControl key={value} layout="horizontal">
            <Checkbox id={`checkbox-${value}`} value={value} />
            <FormControl.Label htmlFor={`checkbox-${value}`}>Checkbox {value}</FormControl.Label>
          </FormControl>
        ))}
      </CheckboxGroup>
      <RadioGroup name="choices">
        <RadioGroup.Label>Radios</RadioGroup.Label>
        {['one', 'two', 'three'].map(value => (
          <FormControl key={value} layout="horizontal">
            <Radio id={`radio-${value}`} value={value} />
            <FormControl.Label htmlFor={`radio-${value}`}>Radio {value}</FormControl.Label>
          </FormControl>
        ))}
      </RadioGroup>
    </div>
  ),
}
export const SingleInput: SingleInputStory = {
  args: {caption: '', disabled: false, label: 'Input', required: false},
  render: args => (
    <FormControl disabled={args.disabled} required={args.required}>
      <FormControl.Label requiredIndicator={args.required}>{args.label}</FormControl.Label>
      <TextInput />
      {args.caption ? <FormControl.Caption>{args.caption}</FormControl.Caption> : null}
    </FormControl>
  ),
}
export const ValidationExample: Story = {
  render: () => (
    <FormControl>
      <FormControl.Label>GitHub handle</FormControl.Label>
      <TextInput aria-invalid block defaultValue="mona lisa" />
      <FormControl.Validation variant="error">GitHub handles cannot contain spaces</FormControl.Validation>
      <FormControl.Caption>
        With or without &quot;@&quot;. For example &quot;monalisa&quot; or &quot;@monalisa&quot;
      </FormControl.Caption>
    </FormControl>
  ),
}
export const WithLeadingVisual: Story = {
  render: () => (
    <Stack gap="none">
      {[
        {caption: false, disabled: false, label: 'Option one'},
        {caption: true, disabled: false, label: 'Option two'},
        {caption: false, disabled: true, label: 'Option three'},
        {caption: true, disabled: true, label: 'Option four'},
      ].map(option => (
        <FormControl key={option.label} disabled={option.disabled} layout="horizontal">
          <Checkbox />
          <FormControl.LeadingVisual>
            <MarkGithubIcon aria-hidden="true" size={option.caption ? 24 : 16} />
          </FormControl.LeadingVisual>
          <div>
            {/* eslint-disable-next-line primer-react/direct-slot-children -- Choice controls group their label and caption beside the input. */}
            <FormControl.Label>{option.label}</FormControl.Label>
            {/* eslint-disable-next-line primer-react/direct-slot-children -- Choice controls group their label and caption beside the input. */}
            {option.caption ? <FormControl.Caption>This one has a caption</FormControl.Caption> : null}
          </div>
        </FormControl>
      ))}
    </Stack>
  ),
}
export const DisabledInputs: Story = {
  render: () => (
    <div className="grid gap-4">
      <FormControl disabled layout="horizontal">
        <Checkbox />
        <FormControl.Label>Disabled checkbox</FormControl.Label>
      </FormControl>
      <FormControl disabled>
        <FormControl.Label>Disabled input</FormControl.Label>
        <TextInput />
      </FormControl>
      <FormControl disabled>
        <FormControl.Label>Disabled select</FormControl.Label>
        <Select defaultValue="figma">
          <Select.Option value="figma">Figma</Select.Option>
          <Select.Option value="css">Primer CSS</Select.Option>
          <Select.Option value="prc">Primer React components</Select.Option>
          <Select.Option value="pvc">Primer ViewComponents</Select.Option>
        </Select>
      </FormControl>
    </div>
  ),
}
export const CustomRequired: Story = {
  render: () => (
    <div className="grid gap-4">
      <FormControl required>
        <FormControl.Label requiredText="(required)">Form Input Label</FormControl.Label>
        <TextInput />
        <FormControl.Caption>This is a form field with a custom required indicator</FormControl.Caption>
      </FormControl>
      <Text className="text-sm">Required fields are marked with an asterisk (*)</Text>
      <FormControl required>
        <FormControl.Label requiredIndicator={false}>Form Input Label</FormControl.Label>
        <TextInput />
        <FormControl.Caption>
          This is a form field with a required indicator that is hidden in the accessibility tree
        </FormControl.Caption>
      </FormControl>
      <FormControl>
        <FormControl.Label requiredIndicator={false} requiredText="(optional)">
          Form Input Label
        </FormControl.Label>
        <TextInput />
        <FormControl.Caption>This is a form field that is marked as optional, it is not required</FormControl.Caption>
      </FormControl>
    </div>
  ),
}
export const WithCaption: Story = {
  render: () => (
    <FormControl>
      <FormControl.Label>Example label</FormControl.Label>
      <TextInput />
      <FormControl.Caption>Example caption</FormControl.Caption>
    </FormControl>
  ),
}
export const WithCaptionAndDisabled: Story = {
  render: () => (
    <FormControl disabled>
      <FormControl.Label>Example label</FormControl.Label>
      <TextInput />
      <FormControl.Caption>Example caption</FormControl.Caption>
    </FormControl>
  ),
}
export const WithHiddenLabel: Story = {
  render: () => (
    <FormControl>
      <FormControl.Label visuallyHidden>Example label</FormControl.Label>
      <TextInput />
    </FormControl>
  ),
}
export const WithRequiredIndicator: Story = {
  render: () => (
    <FormControl>
      <FormControl.Label requiredIndicator>Example label</FormControl.Label>
      <TextInput required />
    </FormControl>
  ),
}
export const WithSuccessValidation: Story = {
  render: () => (
    <FormControl required>
      <FormControl.Label requiredIndicator>Example label</FormControl.Label>
      <TextInput defaultValue="Input value" />
      <FormControl.Validation variant="success">Example success validation message</FormControl.Validation>
    </FormControl>
  ),
}
export const WithErrorValidation: Story = {
  render: () => (
    <FormControl>
      <FormControl.Label requiredIndicator>Example label</FormControl.Label>
      <TextInput aria-invalid defaultValue="Input value" required />
      <FormControl.Validation variant="error">Example error validation message</FormControl.Validation>
    </FormControl>
  ),
}
