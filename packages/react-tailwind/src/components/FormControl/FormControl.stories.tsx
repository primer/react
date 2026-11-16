import type {Meta, StoryObj} from '@storybook/react-vite'
import {Checkbox} from '../Checkbox'
import {TextInput} from '../TextInput'
import {FormControl} from './FormControl'
import {formControlTokens, TokenInputFixture} from './FormControl.stories.helpers'
const meta = {
  title: 'React Tailwind/Forms/FormControl',
  component: FormControl,
} satisfies Meta<typeof FormControl>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <FormControl layout="horizontal" required>
      <Checkbox />
      <div>
        {/* eslint-disable-next-line primer-react/direct-slot-children -- The wrapper groups horizontal label content. */}
        <FormControl.Label requiredIndicator>Form Input Label</FormControl.Label>
        {/* eslint-disable-next-line primer-react/direct-slot-children -- The wrapper groups horizontal label content. */}
        <FormControl.Caption>This is a caption</FormControl.Caption>
      </div>
    </FormControl>
  ),
}
export const Playground: Story = {
  args: {disabled: false},
  render: args => (
    <form>
      <FormControl {...args}>
        <FormControl.Label>Name</FormControl.Label>
        <TextInput className="border-success-emphasis" />
        <FormControl.Validation variant="success">Success!</FormControl.Validation>
        <FormControl.Caption>This is the caption</FormControl.Caption>
      </FormControl>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TokenInputFixture
          className="w-[595px] max-w-full"
          inputClassName="min-w-20"
          initialTokens={formControlTokens.slice(0, 5)}
        />
      </FormControl>
    </form>
  ),
}
