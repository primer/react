import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, waitFor, within} from 'storybook/test'
import {UnderlineNav} from './UnderlineNav'
import {OverflowTemplate} from './UnderlineNav.features.stories'

const meta = {title: 'React Tailwind/Navigation/UnderlineNav/Interactions', component: UnderlineNav} satisfies Meta<
  typeof UnderlineNav
>
export default meta
type Story = StoryObj<typeof meta>

const visibleOrder = ['Code', 'Issues', 'Pull Requests', 'Discussions', 'Actions']

async function setUpOverflow(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)
  canvasElement.style.width = '800px'
  const more = await canvas.findByRole('button', {name: 'More items'})
  return {canvas, menu: within(canvasElement.ownerDocument.body), more}
}

export const KeyboardNavigation: Story = {
  ...OverflowTemplate,
  name: 'Keyboard navigation',
  play: async ({canvasElement}) => {
    const {canvas, more} = await setUpOverflow(canvasElement)

    canvas.getByRole('link', {name: 'Code'}).focus()
    for (const name of visibleOrder.slice(1)) {
      await userEvent.tab()
      await expect(document.activeElement).toHaveTextContent(name)
    }
    await userEvent.tab()
    await expect(more).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(document.activeElement).toHaveTextContent(/^Projects/))
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await expect(document.activeElement).toHaveTextContent(/^Settings/)
    await userEvent.keyboard('{Enter}')

    await waitFor(() => expect(more).toHaveFocus())
    await expect(more).toHaveAttribute('aria-label', 'More items, including current item')

    for (const name of visibleOrder.slice(2).reverse()) {
      await userEvent.tab({shift: true})
      await expect(document.activeElement).toHaveTextContent(name)
    }
  },
}

export const SelectAMenuItem: Story = {
  ...OverflowTemplate,
  play: async ({canvasElement}) => {
    const {canvas, menu, more} = await setUpOverflow(canvasElement)

    await userEvent.click(more)
    await userEvent.click(await menu.findByRole('menuitem', {name: /^Settings/}))

    await waitFor(() => expect(more).toHaveFocus())
    await expect(more).toHaveAttribute('aria-label', 'More items, including current item')
    await expect(canvas.getByRole('link', {name: /^Issues/})).not.toHaveAttribute('aria-current')
  },
}
