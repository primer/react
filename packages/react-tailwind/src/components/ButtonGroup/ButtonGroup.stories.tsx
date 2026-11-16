import type React from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {ButtonGroup} from './ButtonGroup'
import {Button, type ButtonProps} from '../Button'

const meta = {
  title: 'React Tailwind/Display/ButtonGroup',
  component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>
type PlaygroundArgs = React.ComponentProps<typeof ButtonGroup> &
  Pick<ButtonProps, 'disabled' | 'size'> & {
    buttonCount: number
  }
export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </ButtonGroup>
  ),
}
export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    buttonCount: 3,
    disabled: false,
    size: 'medium',
  },
  argTypes: {
    buttonCount: {
      control: {type: 'number', min: 2, max: 6, step: 1},
      description: 'Number of buttons in the group (2-6)',
    },
    disabled: {control: 'boolean'},
    size: {control: 'radio', options: ['small', 'medium']},
  },
  render: ({buttonCount, disabled, size, ...groupProps}) => (
    <ButtonGroup {...groupProps}>
      {Array.from({length: buttonCount}, (_, index) => (
        <Button key={index} disabled={disabled} size={size}>
          Button {index + 1}
        </Button>
      ))}
    </ButtonGroup>
  ),
}
