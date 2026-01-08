import type {ComponentProps} from '../../utils/types'
import type {Meta, StoryFn} from '@storybook/react-vite'
import {UnderlinePanels} from './UnderlinePanels2'

export default {
  title: 'Experimental/Components/UnderlinePanels2/Dev',
  component: UnderlinePanels,
  subcomponents: {Tab: UnderlinePanels.Tab, Panel: UnderlinePanels.Panel, TabList: UnderlinePanels.TabList},
} as Meta<ComponentProps<typeof UnderlinePanels>>

export const Default = () => (
  <UnderlinePanels defaultValue="tab-1">
    <UnderlinePanels.TabList aria-label="Select a tab">
      <UnderlinePanels.Tab value="tab-1">Tab 1</UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="tab-2">Tab 2</UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="tab-3">Tab 3</UnderlinePanels.Tab>
    </UnderlinePanels.TabList>
    <UnderlinePanels.Panel value="tab-1">Panel 1</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tab-2">Panel 2</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tab-3">Panel 3</UnderlinePanels.Panel>
  </UnderlinePanels>
)

export const SingleTabPlayground: StoryFn<ComponentProps<typeof UnderlinePanels.Tab>> = args => {
  return (
    <UnderlinePanels aria-label="Select a tab" defaultValue="users">
      <UnderlinePanels.TabList aria-label="Select a tab">
        <UnderlinePanels.Tab {...args} value="users">
          Users
        </UnderlinePanels.Tab>
      </UnderlinePanels.TabList>
      <UnderlinePanels.Panel value="users">Users Panel</UnderlinePanels.Panel>
    </UnderlinePanels>
  )
}

SingleTabPlayground.args = {
  counter: '14K',
  disabled: false,
}

SingleTabPlayground.argTypes = {
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  counter: {
    control: {
      type: 'text',
    },
  },
}
