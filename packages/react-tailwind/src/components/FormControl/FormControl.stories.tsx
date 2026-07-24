import type {Meta, StoryObj} from '@storybook/react-vite'
import {FormControl} from './FormControl'
const meta = {
  title: 'React Tailwind/Forms/FormControl',
  component: FormControl,
} satisfies Meta<typeof FormControl>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <FormControl>
      <FormControl.Label>Repository</FormControl.Label>
      <FormControl.Control placeholder="owner/repository" />
      <FormControl.Caption>Used to link the deployment.</FormControl.Caption>
    </FormControl>
  ),
}
export const Playground: Story = {
  args: {layout: 'vertical', disabled: false},
  render: (args: React.ComponentProps<typeof FormControl>) => (
    <FormControl {...args}>
      <FormControl.Label>Repository</FormControl.Label>
      <FormControl.Control />
    </FormControl>
  ),
}
