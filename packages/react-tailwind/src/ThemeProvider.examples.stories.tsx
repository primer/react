import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {BaseStyles} from './BaseStyles'
import {ThemeProvider} from './ThemeProvider'

const meta = {
  title: 'React Tailwind/Behaviors/ThemeProvider/Examples',
  component: ThemeProvider,
  parameters: {disableThemeDecorator: true},
} satisfies Meta<typeof ThemeProvider>

export default meta
type Story = StoryObj<typeof meta>

export const NestedScheme: Story = {
  render: () => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        Outer theme
        <ThemeProvider colorMode="night">
          <BaseStyles>Nested night theme</BaseStyles>
        </ThemeProvider>
      </BaseStyles>
    </ThemeProvider>
  ),
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByText('Nested night theme')).toBeVisible()
  },
}
