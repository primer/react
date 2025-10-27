import type {Meta} from '@storybook/react-vite'
import type {RadioProps} from '..'
import {FormControl, Radio} from '..'
import type {FormControlArgs} from '../utils/form-story-helpers'
import {
  formControlArgs,
  formControlArgTypesWithoutValidation,
  getFormControlArgsByChildComponent,
} from '../utils/form-story-helpers'

const excludedControlKeys = ['required', 'value', 'name', 'validationStatus']

export default {
  title: 'Components/Radio',
  component: Radio,
  parameters: {controls: {exclude: excludedControlKeys}},
} as Meta

export const Playground = ({value: _value, ...args}: FormControlArgs<RadioProps>) => {
  const {parentArgs, labelArgs, captionArgs} = getFormControlArgsByChildComponent(args)

  return (
    <form>
      <FormControl {...parentArgs}>
        <Radio name="default-radio-name" value="default" {...args} />
        <FormControl.Label {...labelArgs} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      </FormControl>
    </form>
  )
}
Playground.argTypes = {
  checked: {
    control: {
      type: 'boolean',
    },
  },
  ...formControlArgTypesWithoutValidation,
}
Playground.args = {
  checked: false,
  ...formControlArgs,
}

export const Default = () => (
  <form>
    <FormControl>
      <Radio name="default-radio-name" value="default" />
      <FormControl.Label>Label</FormControl.Label>
    </FormControl>
  </form>
)
