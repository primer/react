import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {BaseStyles} from './BaseStyles'
import {ThemeProvider} from './ThemeProvider'

const meta = {
  title: 'React Tailwind/Behaviors/ThemeProvider/Features',
  component: ThemeProvider,
  parameters: {disableThemeDecorator: true},
} satisfies Meta<typeof ThemeProvider>

export default meta
type Story = StoryObj<typeof meta>

export const ContextOnly: Story = {
  render: () => (
    <ThemeProvider contextOnly>
      <BaseStyles>Theme context without a ThemeProvider wrapper</BaseStyles>
    </ThemeProvider>
  ),
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByText('Theme context without a ThemeProvider wrapper')).toBeVisible()
  },
}
