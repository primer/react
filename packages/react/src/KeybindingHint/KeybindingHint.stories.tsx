import type {Meta} from '@storybook/react'
import {KeybindingHint} from './KeybindingHint'

export default {
  title: 'Components/KeybindingHint',
  component: KeybindingHint,
} satisfies Meta<typeof KeybindingHint>

export const Default = {args: {keys: 'Mod+Shift+K'}}
