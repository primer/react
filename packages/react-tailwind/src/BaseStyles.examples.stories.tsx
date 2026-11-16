import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {BaseStyles} from './BaseStyles'
import {ThemeProvider} from './ThemeProvider'

const meta = {
  title: 'React Tailwind/Behaviors/BaseStyles/Examples',
  component: BaseStyles,
} satisfies Meta<typeof BaseStyles>

export default meta
type Story = StoryObj<typeof meta>

export const ThemedContent: Story = {
  render: () => (
    <ThemeProvider colorMode="night">
      <BaseStyles>Themed content</BaseStyles>
    </ThemeProvider>
  ),
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByText('Themed content')).toBeVisible()
  },
}
