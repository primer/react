import type {Meta, StoryObj} from '@storybook/react-vite'
import {Token} from './Token'
const meta = {title: 'Content/Token', component: Token, args: {text: 'design'}} satisfies Meta<typeof Token>
export default meta
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {args: {size: 'large', isSelected: true, onRemove: () => {}}}
