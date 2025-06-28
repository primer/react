import type {ComponentProps} from '../../utils/types'
import type {Meta, StoryFn} from '@storybook/react-vite'
import UnderlinePanels from './UnderlinePanels'

export default {
  title: 'Experimental/Components/UnderlinePanels/Dev',
  component: UnderlinePanels,
  subcomponents: {Tab: UnderlinePanels.Tab, Panel: UnderlinePanels.Panel},
} as Meta<ComponentProps<typeof UnderlinePanels>>

export const Default = () => (
  <UnderlinePanels aria-label="Select a tab">
    <UnderlinePanels.Tab>Tab 1</UnderlinePanels.Tab>
    <UnderlinePanels.Tab>Tab 2</UnderlinePanels.Tab>
    <UnderlinePanels.Tab>Tab 3</UnderlinePanels.Tab>
    <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 3</UnderlinePanels.Panel>
  </UnderlinePanels>
)

export const SingleTabPlayground: StoryFn<ComponentProps<typeof UnderlinePanels.Tab>> = args => {
  return (
    <UnderlinePanels aria-label="Select a tab">
      <UnderlinePanels.Tab {...args}>Users</UnderlinePanels.Tab>
      <UnderlinePanels.Panel>Users Panel</UnderlinePanels.Panel>
    </UnderlinePanels>
  )
}

SingleTabPlayground.args = {
  'aria-selected': true,
  counter: '14K',
}

SingleTabPlayground.argTypes = {
  'aria-selected': {
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
