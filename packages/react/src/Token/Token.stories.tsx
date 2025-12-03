import type {Meta, StoryFn} from '@storybook/react-vite'
import {action} from 'storybook/actions'
import Token from './Token'
import type {TokenProps} from './Token'
import {GitBranchIcon} from '@primer/octicons-react'

type PlaygroundArgs = Omit<TokenProps, 'leadingVisual' | 'onRemove' | 'onClick'> & {
  leadingVisual: boolean
  onRemove: boolean
  onClick: boolean
}

export default {
  title: 'Components/Token',
  component: Token,
} as Meta<typeof Token>

export const Default = () => <Token text="token" />

export const Playground: StoryFn<PlaygroundArgs> = ({onRemove, onClick, leadingVisual, ...args}) => {
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
  leadingVisual: false,
  hideRemoveButton: false,
  onRemove: false,
  onClick: false,
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
    mapping: {
      true: GitBranchIcon,
      false: undefined,
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
    mapping: {
      true: action('onRemove'),
      false: undefined,
    },
  },
  onClick: {
    control: {
      type: 'boolean',
    },
    mapping: {
      true: action('onClick'),
      false: undefined,
    },
  },
}
