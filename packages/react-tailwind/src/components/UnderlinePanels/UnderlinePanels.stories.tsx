import type {Meta, StoryObj} from '@storybook/react-vite'
import {UnderlinePanels} from './UnderlinePanels'
const meta = {
  title: 'React Tailwind/Navigation/UnderlinePanels',
  component: UnderlinePanels,
} satisfies Meta<typeof UnderlinePanels>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <UnderlinePanels defaultValue="one">
      <UnderlinePanels.List aria-label="Sections">
        <UnderlinePanels.Tab value="one">One</UnderlinePanels.Tab>
        <UnderlinePanels.Tab value="two">Two</UnderlinePanels.Tab>
      </UnderlinePanels.List>
      <UnderlinePanels.Panel value="one">First panel</UnderlinePanels.Panel>
      <UnderlinePanels.Panel value="two">Second panel</UnderlinePanels.Panel>
    </UnderlinePanels>
  ),
}
