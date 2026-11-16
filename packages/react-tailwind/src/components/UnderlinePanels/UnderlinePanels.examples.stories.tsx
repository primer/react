import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {UnderlinePanels} from './UnderlinePanels'

const meta = {
  title: 'React Tailwind/Navigation/UnderlinePanels/Examples',
  component: UnderlinePanels,
} satisfies Meta<typeof UnderlinePanels>
export default meta
type Story = StoryObj<typeof meta>

export const RepositorySections: Story = {
  render: () => (
    <UnderlinePanels defaultValue="overview">
      <UnderlinePanels.List aria-label="Repository sections">
        <UnderlinePanels.Tab value="overview">Overview</UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="security">Security</UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="insights">Insights</UnderlinePanels.Tab>
      </UnderlinePanels.List>
      <UnderlinePanels.Panel value="overview">Repository activity and summary.</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="security">Security alerts and policy checks.</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="insights">Traffic, usage, and contributor insights.</UnderlinePanels.Panel>
    </UnderlinePanels>
  ),
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', {name: 'Security'}))
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Security alerts')
  },
}
