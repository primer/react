import React from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import {KeybindingHint, type KeybindingHintProps} from '.'
import Box from '../Box'

export default {
  title: 'Components/KeybindingHint/Features',
  component: KeybindingHint,
} satisfies Meta<typeof KeybindingHint>

const chord = 'Mod+Shift+K'

export const Condensed = {args: {keys: chord}}

export const Full = {args: {keys: chord, format: 'full'}}

const sequence = 'Mod+x y z'

export const SequenceCondensed = {args: {keys: sequence}}

export const SequenceFull = {args: {keys: sequence, format: 'full'}}

export const OnEmphasis: StoryObj<KeybindingHintProps> = {
  render: args => (
    <Box sx={{backgroundColor: 'accent.fg', p: 3}}>
      <KeybindingHint {...args} />
    </Box>
  ),
  args: {keys: chord, variant: 'onEmphasis'},
}
