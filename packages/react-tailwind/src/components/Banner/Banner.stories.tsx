import type {Meta, StoryObj} from '@storybook/react-vite'
import {Banner} from './Banner'
const meta = {
  title: 'Content/Banner',
  component: Banner,
  args: {title: 'Important update', children: 'This is additional context.'},
} satisfies Meta<typeof Banner>
export default meta
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {args: {variant: 'warning', layout: 'compact', onDismiss: () => {}}}
