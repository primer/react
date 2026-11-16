import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {BaseStyles} from './BaseStyles'
import {useTheme} from './ThemeContext'
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

function ResolvedMode() {
  const {resolvedColorMode} = useTheme()
  return <span data-testid="resolved-mode">{resolvedColorMode}</span>
}

export const HighContrastSchemes: Story = {
  render: () => (
    <>
      <ThemeProvider colorMode="light" dayScheme="light_high_contrast" data-testid="light-high-contrast">
        <BaseStyles>Light high contrast</BaseStyles>
      </ThemeProvider>
      <ThemeProvider colorMode="dark" nightScheme="dark_high_contrast" data-testid="dark-high-contrast">
        <BaseStyles>Dark high contrast</BaseStyles>
      </ThemeProvider>
      <ThemeProvider
        colorMode="auto"
        dayScheme="light_high_contrast"
        nightScheme="dark_high_contrast"
        data-testid="auto-high-contrast"
      >
        <BaseStyles>
          Automatic high contrast: <ResolvedMode />
        </BaseStyles>
      </ThemeProvider>
    </>
  ),
}
