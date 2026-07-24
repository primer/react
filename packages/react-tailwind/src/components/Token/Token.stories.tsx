import type {Meta, StoryObj} from '@storybook/react-vite'
import {Token} from './Token'
const meta = {title: 'React Tailwind/Content/Token', component: Token, args: {text: 'design'}} satisfies Meta<
  typeof Token
>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {size: 'large', isSelected: true, onRemove: () => {}}}
