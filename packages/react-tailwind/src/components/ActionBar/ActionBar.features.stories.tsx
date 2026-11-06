import type {Meta, StoryObj} from '@storybook/react-vite'
import {GearIcon, PersonIcon, TriangleDownIcon} from '@primer/octicons-react'
import React from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {SelectPanel} from '../SelectPanel'
import {ActionBar} from './ActionBar'

const meta = {
  title: 'React Tailwind/Data/ActionBar/Features',
  component: ActionBar,
} satisfies Meta<typeof ActionBar>

export default meta
type Story = StoryObj<typeof meta>

export const RovingFocus: Story = {
  render: () => (
    <ActionBar aria-label="Issue actions">
      <ActionBar.Button>Assign</ActionBar.Button>
      <ActionBar.Button>Label</ActionBar.Button>
      <ActionBar.Button disabled>Disabled</ActionBar.Button>
    </ActionBar>
  ),
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('button', {name: 'Label'})).toHaveFocus()
  },
}

export const OverflowAccessibility: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <>
        <button type="button">Outside target</button>
        <div data-testid="metadata-action-bar" style={{width: 64}}>
          <ActionBar aria-label="Issue metadata">
            <ActionBar.Button>Author</ActionBar.Button>
            <ActionBar.Button disabled>Labels</ActionBar.Button>
            <ActionBar.IconButton aria-label="Assignee" icon={PersonIcon} />
            <SelectPanel
              items={[{id: 1, text: 'Roadmap'}]}
              onOpenChange={setOpen}
              onSelectedChange={() => {}}
              open={open}
              renderAnchor={props => <ActionBar.Button {...props} trailingVisual={TriangleDownIcon} />}
              selected={undefined}
              title="Projects"
            />
            <ActionBar.Group>
              <ActionBar.Button>Milestone</ActionBar.Button>
              <ActionBar.Button>Iteration</ActionBar.Button>
            </ActionBar.Group>
            <ActionBar.Menu aria-label="Settings" icon={GearIcon} items={[{label: 'Configure'}]} />
          </ActionBar>
        </div>
      </>
    )
  },
}
