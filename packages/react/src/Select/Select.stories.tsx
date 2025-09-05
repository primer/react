import type {Meta} from '@storybook/react-vite'
import {FormControl} from '..'
import Select from './Select'
import type {SelectProps} from './Select'
import type {FormControlArgs} from '../utils/form-story-helpers'
import {
  formControlArgs,
  formControlArgTypes,
  getFormControlArgsByChildComponent,
  inputWrapperArgTypes,
} from '../utils/form-story-helpers'

export default {
  title: 'Components/Select',
  component: Select,
  parameters: {
    controls: {
      exclude: ['hasTrailingAction', 'monospace', 'isInputFocused'],
    },
  },
} as Meta

export const Playground = (args: FormControlArgs<SelectProps>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)

  return (
    <form>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
        <Select {...args}>
          <Select.Option value="one">Choice one</Select.Option>
          <Select.Option value="two">Choice two</Select.Option>
          <Select.Option value="three">Choice three</Select.Option>
          <Select.Option value="four">Choice four</Select.Option>
          <Select.Option value="five">Choice five</Select.Option>
          <Select.Option value="six">Choice six</Select.Option>
        </Select>
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </form>
  )
}
Playground.args = {
  ...formControlArgs,
}
Playground.argTypes = {
  ...inputWrapperArgTypes,
  ...formControlArgTypes,
}

export const Default = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Select>
        <Select.Option value="one">Choice one</Select.Option>
        <Select.Option value="two">Choice two</Select.Option>
        <Select.Option value="three">Choice three</Select.Option>
        <Select.Option value="four">Choice four</Select.Option>
        <Select.Option value="five">Choice five</Select.Option>
        <Select.Option value="six">Choice six</Select.Option>
      </Select>
    </FormControl>
  </form>
)
