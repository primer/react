import type React from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {Label} from '../Label'
import {Token} from '../Token'
import {LabelGroup} from './LabelGroup'

const labels = [
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
]

const ResizableContainer = ({children, ...props}: {children: React.ReactNode}) => (
  <div className="w-[600px] resize overflow-auto p-1 outline outline-1 outline-black" {...props}>
    {children}
  </div>
)

const labelChildren = labels.map(label => <Label key={label}>{label}</Label>)
const interactiveTokenChildren = labels.map(label => <Token key={label} as="button" text={label} />)

const meta = {title: 'React Tailwind/Display/LabelGroup/Features', component: LabelGroup} satisfies Meta<
  typeof LabelGroup
>

export default meta
type Story = StoryObj<typeof meta>

export const TruncateAuto: Story = {
  render: () => (
    <ResizableContainer>
      <LabelGroup visibleChildCount="auto">{labelChildren}</LabelGroup>
    </ResizableContainer>
  ),
}

export const TruncateAutoWithInteractiveTokens: Story = {
  render: () => (
    <ResizableContainer>
      <LabelGroup visibleChildCount="auto">{interactiveTokenChildren}</LabelGroup>
    </ResizableContainer>
  ),
}

export const TruncateAfterFive: Story = {
  render: () => <LabelGroup visibleChildCount={5}>{labelChildren}</LabelGroup>,
}

export const TruncateAutoExpandInline: Story = {
  render: () => (
    <ResizableContainer>
      <LabelGroup overflowStyle="inline" visibleChildCount="auto">
        {labelChildren}
      </LabelGroup>
    </ResizableContainer>
  ),
}

export const TruncateAutoExpandInlineWithInteractiveTokens: Story = {
  render: () => (
    <ResizableContainer>
      <LabelGroup overflowStyle="inline" visibleChildCount="auto">
        {interactiveTokenChildren}
      </LabelGroup>
    </ResizableContainer>
  ),
}
