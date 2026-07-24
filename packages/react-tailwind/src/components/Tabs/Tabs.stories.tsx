import type {Meta, StoryObj} from '@storybook/react-vite'
import {Tab, TabList, TabPanel, Tabs} from './Tabs'
const meta = {
  title: 'React Tailwind/Navigation/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="code">
      <TabList aria-label="View">
        <Tab value="code">Code</Tab>
        <Tab value="issues">Issues</Tab>
      </TabList>
      <TabPanel value="code">Code panel</TabPanel>
      <TabPanel value="issues">Issues panel</TabPanel>
    </Tabs>
  ),
}
