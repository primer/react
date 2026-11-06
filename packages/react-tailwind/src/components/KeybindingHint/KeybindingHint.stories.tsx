import type {Meta, StoryObj} from '@storybook/react-vite'
import {KeybindingHint} from './KeybindingHint'
const meta = {
  title: 'React Tailwind/Content/KeybindingHint',
  component: KeybindingHint,
  args: {keys: 'Mod+Shift+K'},
} satisfies Meta<typeof KeybindingHint>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {keys: 'Mod+k g', format: 'full'}}
