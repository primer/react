import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {FeatureFlags} from './FeatureFlags'
import {useFeatureFlag} from './useFeatureFlag'

const meta = {
  title: 'React Tailwind/Utilities/FeatureFlags/Examples',
  component: FeatureFlags,
  args: {flags: {}},
} satisfies Meta<typeof FeatureFlags>

export default meta
type Story = StoryObj<typeof meta>

function FlaggedContentValue() {
  return <p>{useFeatureFlag('newExperience') ? 'New experience enabled' : 'Default experience'}</p>
}

export const FlaggedContent: Story = {
  render: () => (
    <FeatureFlags flags={{newExperience: true}}>
      <FlaggedContentValue />
    </FeatureFlags>
  ),
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByText('New experience enabled')).toBeVisible()
  },
}
