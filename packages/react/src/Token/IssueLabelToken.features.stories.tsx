import React from 'react'
import IssueLabelToken from './IssueLabelToken'
import Box from '../Box'
import {action} from '@storybook/addon-actions'
import type {StoryObj} from '@storybook/react'
import type {hexString} from '../utils/isHex'

export default {
  title: 'Components/IssueLabelToken',
  component: IssueLabelToken,
}
const variants = [
  'pink',
  'plum',
  'purple',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'pine',
  'green',
  'lime',
  'olive',
  'lemon',
  'yellow',
  'orange',
  'amber',
  'red',
  'coral',
  'gray',
  'brown',
  'auburn',
] as const

type Variants = typeof variants
type Variant = Variants[number]

export const Interactive: StoryObj = ({variant}: {variant: Variant}) => {
  return (
    <Box
      sx={{
        alignItems: 'start',
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
        padding: 2,
      }}
    >
      <IssueLabelToken
        href="/?path=/story/drafts-components-issuelabeltoken-interactive--interactive"
        variant={variant}
        text="Link"
      />
      <IssueLabelToken onClick={action('clicked')} variant={variant} text="Button" />
      <IssueLabelToken tabIndex={0} onFocus={action('focused')} variant={variant} text="Focusable Span" />
      <IssueLabelToken
        text="Removable Button"
        variant={variant}
        onRemove={action('remove clicked')}
        onClick={action('button clicked')}
      />
    </Box>
  )
}

Interactive.args = {
  variant: variants[0],
}
Interactive.argTypes = {
  variant: {
    control: {
      type: 'select',
    },
    options: [...variants, undefined],
  },
}

export const Hex: StoryObj = ({
  hex,
  text,
  interactive,
  ...args
}: {
  hex: hexString
  interactive: boolean
  text: string
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        overflow: 'hidden',
        padding: 2,
      }}
    >
      <IssueLabelToken {...args} text={text} fillColor={hex} onClick={interactive ? () => {} : undefined} />
    </Box>
  )
}
Hex.args = {
  hex: '#59B200',
  text: 'New Token',
  variant: undefined,
  interactive: true,
}
Hex.argTypes = {
  hex: {control: {type: 'color'}},
  variant: {control: {disable: true}},
  interactive: {control: {type: 'boolean'}},
}
