import type {Meta, StoryObj} from '@storybook/react-vite'
import {Tab, TabList, TabPanel, Tabs} from './Tabs'
const meta = {
  title: 'React Tailwind/Navigation/Tabs',
  component: Tabs,
  args: {defaultValue: 'code', orientation: 'horizontal'},
  argTypes: {
    defaultValue: {control: 'select', options: ['code', 'issues']},
    orientation: {control: 'radio', options: ['horizontal', 'vertical']},
  },
  parameters: {controls: {include: ['defaultValue', 'orientation']}},
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="one">
      <TabList aria-label="Tabs">
        <Tab value="one">One</Tab>
        <Tab value="two">Two</Tab>
        <Tab value="three">Three</Tab>
      </TabList>
      <TabPanel value="one">Panel one</TabPanel>
      <TabPanel value="two">Panel two</TabPanel>
      <TabPanel value="three">Panel three</TabPanel>
    </Tabs>
  ),
}

export const Playground: Story = {
  render: args => (
    <Tabs defaultValue={args.defaultValue} orientation={args.orientation}>
      <TabList aria-label="View" className={args.orientation === 'vertical' ? 'flex-col w-fit' : undefined}>
        <Tab value="code">Code</Tab>
        <Tab value="issues">Issues</Tab>
      </TabList>
      <TabPanel value="code">Code panel</TabPanel>
      <TabPanel value="issues">Issues panel</TabPanel>
    </Tabs>
  ),
}
