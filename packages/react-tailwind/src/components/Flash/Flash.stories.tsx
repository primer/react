import type {Meta, StoryObj} from '@storybook/react-vite'
import {Flash} from './Flash'
const meta = {title: 'Content/Flash', component: Flash, args: {children: 'Changes saved.'}} satisfies Meta<typeof Flash>
export default meta
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {args: {variant: 'warning', full: true}}
