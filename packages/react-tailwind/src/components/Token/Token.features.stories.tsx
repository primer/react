import {GitBranchIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {IssueLabelToken} from './IssueLabelToken'
import {Token} from './Token'

const meta = {
  title: 'React Tailwind/Content/Token/Features',
  component: Token,
  args: {text: 'token'},
} satisfies Meta<typeof Token>

export default meta
type Story = StoryObj<typeof meta>

export const InteractiveToken: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Token as="a" href="#" text="Link" />
      <Token as="button" onClick={() => {}} text="Button" />
    </div>
  ),
}

export const TokenWithLeadingVisual: Story = {
  render: () => <Token text="token" leadingVisual={GitBranchIcon} />,
}

export const TokenWithOnRemoveFn: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Token text="token" onRemove={() => {}} />
      <Token as="a" href="#" onRemove={() => {}} text="Link" />
      <Token as="button" onClick={() => {}} onRemove={() => {}} text="Button" />
    </div>
  ),
}

export const DefaultIssueLabelToken: Story = {
  render: () => <IssueLabelToken text="good first issue" />,
}

export const InteractiveIssueLabelToken: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <IssueLabelToken as="a" href="#" text="Link" />
      <IssueLabelToken as="button" onClick={() => {}} text="Button" />
    </div>
  ),
}

export const IssueLabelTokenWithOnRemoveFn: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <IssueLabelToken text="token" onRemove={() => {}} />
      <IssueLabelToken as="a" href="#" onRemove={() => {}} text="Link" />
      <IssueLabelToken as="button" onClick={() => {}} onRemove={() => {}} text="Button" />
    </div>
  ),
}

export const SmallToken: Story = {args: {text: 'token', size: 'small'}}
export const MediumlToken: Story = {args: {text: 'token', size: 'medium'}}
export const LargeToken: Story = {args: {text: 'token', size: 'xlarge'}}
export const XLargeToken: Story = {args: {text: 'token', size: 'xlarge'}}

export const IssueLabelTokenCustomColors: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-wrap items-start gap-2">
        <IssueLabelToken as="a" href="#" text="Link" fillColor="#0366d6" />
        <IssueLabelToken as="button" onClick={() => {}} text="Button" fillColor="lightpink" />
      </div>
      <h3>Color examples</h3>
      <div className="flex flex-wrap items-start gap-2">
        {[
          ['😀 Link', '#8c50c8'],
          ['Token', '#a9d3bc'],
          ['🚨 Problem', '#98afa7'],
          ['📥 Inbox', '#573807'],
          ['deeppink', '#b7b41e'],
          ['👹 Link', '#0f65b1'],
          ['Tiger', '#e7bc68'],
          ['🐛 coral', '#D6F2DE'],
          ['Long label', '#161E37'],
          ['✅ Done', '#232323'],
          ['Hello', '#E0E0E0'],
          ['Lorem', '#aed531'],
          ['Lorem', '#d980fc'],
          ['Lorem', '#e7f922'],
          ['🚀 Lorem', '#ef70e9'],
          ['Lorem', '#72ea84'],
          ['Lorem', '#87e50b'],
          ['🤷 Lorem', '#fcf646'],
          ['💡 Light', '#E40C74'],
        ].map(([text, fillColor], index) => (
          <IssueLabelToken key={`${text}-${index}`} text={text} fillColor={fillColor} />
        ))}
      </div>
    </div>
  ),
}

export const DismissibleToken: Story = {
  render: function DismissibleTokenStory() {
    const [visible, setVisible] = useState(true)
    return visible ? <Token text="remove me" onRemove={() => setVisible(false)} /> : <span>Token removed</span>
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Remove remove me'}))
    await expect(canvas.getByText('Token removed')).toBeInTheDocument()
  },
}
