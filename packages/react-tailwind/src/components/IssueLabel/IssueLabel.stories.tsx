import type {Meta, StoryObj} from '@storybook/react-vite'
import {IssueLabel} from './IssueLabel'
const meta = {title: 'Content/IssueLabel', component: IssueLabel, args: {children: 'bug'}} satisfies Meta<
  typeof IssueLabel
>
export default meta
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {args: {variant: 'red', href: '#label'}}
