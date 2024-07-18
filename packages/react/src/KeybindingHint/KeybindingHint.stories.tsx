import type React from 'react'
import type {Meta} from '@storybook/react'
import {KeybindingHint} from './KeybindingHint'

type KeybindingHintProps = React.ComponentProps<typeof KeybindingHint>

const args = {
  keys: 'Mod+Shift+K',
} satisfies KeybindingHintProps

const meta = {
  title: 'Components/KeybindingHint',
  component: KeybindingHint,
} satisfies Meta<typeof KeybindingHint>

export default meta

export const Condensed = {args}

export const Full = {args: {...args, format: 'full'}}

const sequenceArgs = {
  keys: 'Mod+x y z',
} satisfies KeybindingHintProps

export const SequenceCondensed = {args: sequenceArgs}

export const SequenceFull = {args: {...sequenceArgs, format: 'full'}}
