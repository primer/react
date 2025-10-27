/* eslint-disable primer-react/spread-props-first */
import type {StoryFn, Meta} from '@storybook/react-vite'
import ButtonGroup from './ButtonGroup'
import type {ButtonProps} from '../Button'
import {Button} from '../Button'

export default {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  argTypes: {
    as: {table: {disable: true}},
    ref: {table: {disable: true}},
    theme: {table: {disable: true}},
    forwardedAs: {table: {disable: true}},
    sx: {table: {disable: true}},
  },
} as Meta<typeof ButtonGroup>

export const Default = () => (
  <ButtonGroup>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
    <Button>Button 3</Button>
  </ButtonGroup>
)

export const Playground: StoryFn<ButtonProps & {buttonCount: number}> = args => {
  const {buttonCount = 3, ...buttonProps} = args
  const buttons = Array.from({length: buttonCount}, (_, i) => (
    <Button key={i} {...buttonProps}>
      {`Button ${i + 1}`}
    </Button>
  ))

  return <ButtonGroup>{buttons}</ButtonGroup>
}
Playground.args = {
  size: 'medium',
  disabled: false,
  buttonCount: 3,
}
Playground.argTypes = {
  size: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium'],
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  buttonCount: {
    control: {
      type: 'number',
      min: 2,
      max: 6,
      step: 1,
    },
    description: 'Number of buttons in the group (2-6)',
  },
}
