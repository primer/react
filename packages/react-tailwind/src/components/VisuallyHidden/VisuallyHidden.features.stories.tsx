import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {VisuallyHidden} from './VisuallyHidden'

const meta = {
  title: 'React Tailwind/Display/VisuallyHidden/Features',
  component: VisuallyHidden,
} satisfies Meta<typeof VisuallyHidden>

export default meta
type Story = StoryObj<typeof meta>

export const FocusableSkipLink: Story = {
  render: () => (
    <>
      <a href="#main-content">
        <VisuallyHidden>Skip to main content</VisuallyHidden>
      </a>
      <main id="main-content">Main content</main>
    </>
  ),
  play: async ({canvasElement}) => {
    const skipLink = within(canvasElement).getByRole('link', {name: 'Skip to main content'})
    skipLink.focus()
    await expect(skipLink).toHaveFocus()
  },
}
