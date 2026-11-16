import type {Meta, StoryObj} from '@storybook/react-vite'
import {Label} from './Label'

const meta = {title: 'React Tailwind/Display/Label/Features', component: Label} satisfies Meta<typeof Label>
export default meta
type Story = StoryObj<typeof meta>
export const Primary: Story = {args: {variant: 'primary', children: 'Primary'}}
export const Secondary: Story = {args: {variant: 'secondary', children: 'Secondary'}}
export const Accent: Story = {args: {variant: 'accent', children: 'Accent'}}
export const Success: Story = {args: {variant: 'success', children: 'Success'}}
export const Attention: Story = {args: {variant: 'attention', children: 'Attention'}}
export const Severe: Story = {args: {variant: 'severe', children: 'Primary'}}
export const Danger: Story = {args: {variant: 'danger', children: 'Danger'}}
export const Done: Story = {args: {variant: 'done', children: 'Done'}}
export const Sponsors: Story = {args: {variant: 'sponsors', children: 'Sponsors'}}
export const SizeLarge: Story = {args: {size: 'large', children: 'Default'}}
export const SizeSmall: Story = {args: {size: 'small', children: 'Default'}}
