import type {Meta, StoryObj} from '@storybook/react-vite'
import {KeybindingHint} from './KeybindingHint'
const meta = {title: 'Content/KeybindingHint', component: KeybindingHint, args: {keys: 'Mod+k'}} satisfies Meta<
  typeof KeybindingHint
>
export default meta
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {args: {keys: 'Mod+k g', format: 'full', variant: 'onEmphasis'}}
