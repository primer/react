import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {BaseStyles} from './BaseStyles'
import {ThemeProvider} from './ThemeProvider'
import {useTheme} from './ThemeContext'

const meta = {
  title: 'React Tailwind/Behaviors/ThemeProvider',
  component: ThemeProvider,
  parameters: {disableThemeDecorator: true},
  args: {
    colorMode: 'day',
    dayScheme: 'light',
    nightScheme: 'dark',
    contextOnly: false,
  },
  argTypes: {
    colorMode: {control: 'select', options: ['day', 'night', 'light', 'dark', 'auto']},
    contextOnly: {control: 'boolean'},
    dayScheme: {control: 'text'},
    nightScheme: {control: 'text'},
  },
} satisfies Meta<typeof ThemeProvider>

export default meta
type Story = StoryObj<typeof meta>

// Paints the provider's own background so the sample stays legible when the Storybook theme differs.
function ColorScheme() {
  return <p className="m-0 bg-default p-3">Active color scheme: {useTheme().colorMode}</p>
}

export const Default: Story = {
  render: () => (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <ColorScheme />
      </BaseStyles>
    </ThemeProvider>
  ),
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByText('Active color scheme: day')).toBeVisible()
  },
}

export const Playground: Story = {
  render: args => (
    <ThemeProvider {...args}>
      <BaseStyles>
        <ColorScheme />
      </BaseStyles>
    </ThemeProvider>
  ),
}
