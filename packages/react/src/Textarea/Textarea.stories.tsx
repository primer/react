import type {Meta} from '@storybook/react-vite'
import type {TextareaProps} from '..'
import {FormControl, Textarea} from '..'
import {DEFAULT_TEXTAREA_COLS, DEFAULT_TEXTAREA_RESIZE, DEFAULT_TEXTAREA_ROWS} from '../Textarea'
import type {FormControlArgs} from '../utils/story-helpers'
import {formControlArgTypes, formControlArgs, getFormControlArgsByChildComponent} from '../utils/story-helpers'

export default {
  title: 'Components/Textarea',
  component: Textarea,
} as Meta

export const Playground = (args: FormControlArgs<TextareaProps>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  return (
    <form>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
        <Textarea {...args} />
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
  block: false,
  cols: DEFAULT_TEXTAREA_COLS,
  disabled: false,
  resize: DEFAULT_TEXTAREA_RESIZE,
  contrast: false,
  rows: DEFAULT_TEXTAREA_ROWS,
  validationStatus: undefined,
}
Playground.argTypes = {
  block: {
    control: {type: 'boolean'},
  },
  cols: {
    control: {type: 'number'},
  },
  disabled: {
    control: {type: 'boolean'},
  },
  resize: {
    options: ['none', 'both', 'horizontal', 'vertical'],
    control: {type: 'radio'},
  },
  contrast: {
    control: {type: 'boolean'},
  },
  rows: {
    control: {type: 'number'},
  },
  sx: {
    table: {
      disable: true,
    },
  },
  validationStatus: {
    options: ['error', 'success'],
    control: {type: 'radio'},
  },
  ...formControlArgTypes,
}

export const Default = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea />
    </FormControl>
  </form>
)
