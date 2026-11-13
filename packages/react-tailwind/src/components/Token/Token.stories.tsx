import type {Meta, StoryObj} from '@storybook/react-vite'
import {Token} from './Token'
const meta = {title: 'React Tailwind/Content/Token', component: Token, args: {text: 'token'}} satisfies Meta<
  typeof Token
>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {text: 'Token', size: 'medium', isSelected: false}}
