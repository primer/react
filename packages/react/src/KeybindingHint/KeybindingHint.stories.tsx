import type {Meta} from '@storybook/react-vite'
import {KeybindingHint} from './KeybindingHint'

export default {
  title: 'Experimental/Components/KeybindingHint',
  component: KeybindingHint,
} satisfies Meta<typeof KeybindingHint>

export const Default = () => <KeybindingHint keys="Mod+Shift+K" />
