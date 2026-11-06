import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, waitFor, within} from 'storybook/test'
import {UnderlineNav} from './UnderlineNav'
import {OverflowTemplate} from './UnderlineNav.features.stories'

const meta = {
  title: 'React Tailwind/Navigation/UnderlineNav/Interactions',
  component: UnderlineNav,
  // Matches Primer React's interaction stories, which narrow the canvas so the last items overflow into "More".
  beforeEach: ({canvasElement}) => {
    canvasElement.style.width = '800px'
    return () => {
      canvasElement.style.width = ''
    }
  },
} satisfies Meta<typeof UnderlineNav>
export default meta
type Story = StoryObj<typeof meta>

export const KeyboardNavigation: Story = {
  ...OverflowTemplate,
  name: 'Keyboard navigation',
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const menu = within(canvasElement.ownerDocument.body)
    // "More" stays hidden until an item overflows, so finding it waits for the overflow measurement.
    const more = await canvas.findByRole('button', {name: 'More items'})

    canvas.getByRole('link', {name: 'Code'}).focus()
    for (const name of ['Issues', 'Pull Requests', 'Discussions', 'Actions']) {
      await userEvent.tab()
      await expect(document.activeElement).toHaveTextContent(name)
    }
    await userEvent.tab()
    await expect(more).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(menu.getByRole('menuitem', {name: /^Projects/})).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    await expect(menu.getByRole('menuitem', {name: /^Insights/})).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(more).toHaveFocus())

    await userEvent.tab({shift: true})
    await expect(document.activeElement).toHaveTextContent('Actions')
  },
}

export const SelectAMenuItem: Story = {
  ...OverflowTemplate,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const menu = within(canvasElement.ownerDocument.body)
    const more = await canvas.findByRole('button', {name: 'More items'})

    await userEvent.click(more)
    await userEvent.click(await menu.findByRole('menuitem', {name: /^Settings/}))

    // The selected item stays in the menu, so "More" takes the current-item indicator and gets focus back.
    await waitFor(() => expect(more).toHaveFocus())
    await expect(more).toHaveAccessibleName('More items, including current item')
    await expect(more).toHaveAttribute('data-current')
    await expect(canvas.getByRole('link', {name: /^Issues/})).not.toHaveAttribute('aria-current')
  },
}
