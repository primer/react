import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {FeatureFlags} from './FeatureFlags'
import {useFeatureFlag} from './useFeatureFlag'

const meta = {
  title: 'React Tailwind/Utilities/FeatureFlags',
  component: FeatureFlags,
  args: {flags: {}},
} satisfies Meta<typeof FeatureFlags>

export default meta
type Story = StoryObj<typeof meta>

function FlagValue() {
  return <span>{useFeatureFlag('example') ? 'Enabled' : 'Disabled'}</span>
}

export const Default: Story = {
  render: () => (
    <FeatureFlags flags={{example: true}}>
      <FlagValue />
    </FeatureFlags>
  ),
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByText('Enabled')).toBeVisible()
  },
}

export const Playground: Story = {
  args: {flags: {example: true}},
  render: args => (
    <FeatureFlags {...args}>
      <FlagValue />
    </FeatureFlags>
  ),
}
