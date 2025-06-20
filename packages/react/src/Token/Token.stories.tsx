import type {Meta, StoryFn} from '@storybook/react-vite'
import {action} from 'storybook/actions'
import Token from './Token'
import {GitBranchIcon} from '@primer/octicons-react'

export default {
  title: 'Components/Token',
  component: Token,
} as Meta<typeof Token>

export const Default = () => <Token text="token" />

export const Playground: StoryFn<typeof Token> = ({onRemove, onClick, leadingVisual, ...args}) => {
  return (
    <Token
      {...args}
      onRemove={onRemove ? action('onRemove') : undefined}
      onClick={onClick ? action('onClick') : undefined}
      leadingVisual={leadingVisual ? GitBranchIcon : undefined}
    />
  )
}
Playground.args = {
  text: 'Token',
  size: 'medium',
  isSelected: false,
  leadingVisual: undefined,
  hideRemoveButton: false,
  onRemove: undefined,
  onClick: undefined,
}
Playground.argTypes = {
  size: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium', 'large', 'xlarge'],
  },
  isSelected: {
    control: {
      type: 'boolean',
    },
  },
  leadingVisual: {
    control: {
      type: 'boolean',
    },
  },
  hideRemoveButton: {
    control: {
      type: 'boolean',
    },
  },
  onRemove: {
    control: {
      type: 'boolean',
    },
  },
  onClick: {
    control: {
      type: 'boolean',
    },
  },
}
