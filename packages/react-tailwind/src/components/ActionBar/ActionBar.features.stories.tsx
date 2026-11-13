import type {Meta, StoryObj} from '@storybook/react-vite'
import {GearIcon, PersonIcon, TriangleDownIcon} from '@primer/octicons-react'
import React from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Button} from '../Button'
import {SelectPanel, type SelectPanelItem} from '../SelectPanel'
import {ActionBar} from './ActionBar'

const meta = {
  title: 'React Tailwind/Data/ActionBar/Features',
  component: ActionBar,
} satisfies Meta<typeof ActionBar>

export default meta
type Story = StoryObj<typeof meta>

const projectItems = [{text: 'bug'}]

export const SelectPanelComposition: StoryObj<
  React.ComponentProps<typeof ActionBar> & {strictMode: boolean; toolbarWidth: number}
> = {
  args: {strictMode: false, toolbarWidth: 30},
  argTypes: {
    strictMode: {control: 'boolean'},
    toolbarWidth: {control: {type: 'number', min: 30, max: 600}},
  },
  render: ({strictMode, toolbarWidth}) => {
    const [selected, setSelected] = React.useState<SelectPanelItem[]>([])
    const content = (
      <>
        <button type="button">Outside target</button>
        <ActionBar aria-label="Filters" style={{width: toolbarWidth}}>
          <SelectPanel
            title="Filter by project"
            items={projectItems}
            selected={selected}
            onSelectedChange={setSelected}
            renderAnchor={() => <ActionBar.Button>Projects</ActionBar.Button>}
          />
          <ActionBar.Button>Labels</ActionBar.Button>
        </ActionBar>
        <p data-testid="project-selection">
          {selected.length > 0 ? selected.map(item => item.text).join(', ') : 'None selected'}
        </p>
      </>
    )
    return strictMode ? <React.StrictMode>{content}</React.StrictMode> : content
  },
  play: async ({canvasElement}) => {
    const page = within(canvasElement.ownerDocument.body)
    const more = await page.findByRole('button', {name: 'More items'})
    await userEvent.click(more)
    await userEvent.click(await page.findByRole('menuitem', {name: 'Projects'}))
    const filter = await page.findByRole('combobox', {name: 'Filter items'})
    await expect(filter).toHaveFocus()
    await userEvent.click(await page.findByRole('option', {name: 'bug'}))
    await expect(page.getByTestId('project-selection')).toHaveTextContent('bug')
    await userEvent.keyboard('{Escape}')
    await expect(more).toHaveFocus()
  },
}

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
        <p>Outside content</p>
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

export const GuardedOverflowPicker: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [declined, setDeclined] = React.useState(false)
    return (
      <>
        <button type="button">Outside target</button>
        <button type="button" onClick={() => setOpen(false)}>
          Finish outside
        </button>
        <p role="status">{declined ? 'Close request declined' : 'Waiting for a close request'}</p>
        <div style={{width: 64}}>
          <ActionBar aria-label="Issue metadata">
            <ActionBar.Button>Author</ActionBar.Button>
            <SelectPanel
              items={[{id: 1, text: 'Roadmap'}]}
              onOpenChange={nextOpen => {
                if (nextOpen) setOpen(true)
                else setDeclined(true)
              }}
              onSelectedChange={() => {}}
              open={open}
              renderAnchor={props => <ActionBar.Button {...props} trailingVisual={TriangleDownIcon} />}
              secondaryAction={<Button onClick={() => setOpen(false)}>Finish pending work</Button>}
              selected={undefined}
              title="Projects"
            />
          </ActionBar>
        </div>
      </>
    )
  },
}
