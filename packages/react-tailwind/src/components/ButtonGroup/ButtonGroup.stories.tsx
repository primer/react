import type {Meta, StoryObj} from '@storybook/react-vite'
import {ButtonGroup} from './ButtonGroup'
import {Button} from '../Button'

const meta = {
  title: 'React Tailwind/Display/ButtonGroup',
  component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </ButtonGroup>
  ),
}
export const Playground: Story = {args: {orientation: 'vertical'}}
