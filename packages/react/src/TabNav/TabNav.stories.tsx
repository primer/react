import type {Meta, StoryFn} from '@storybook/react-vite'
import TabNav from './TabNav'
import type {ComponentProps} from '../utils/types'

export default {
  title: 'Deprecated/Components/TabNav',
  component: TabNav,
  subcomponents: {
    'TabNav.Link': TabNav.Link,
  },
} as Meta<ComponentProps<typeof TabNav>>

export const Playground: StoryFn<ComponentProps<typeof TabNav>> = args => (
  <TabNav {...args}>
    <TabNav.Link href="#" selected>
      Home
    </TabNav.Link>
    <TabNav.Link href="#">Documentation</TabNav.Link>
    <TabNav.Link href="#">Support</TabNav.Link>
  </TabNav>
)

Playground.args = {
  'aria-label': 'Navigation',
}
Playground.argTypes = {
  'aria-label': {
    type: 'string',
  },
}

export const Default = () => (
  <TabNav aria-label="Main">
    <TabNav.Link href="#" selected>
      Home
    </TabNav.Link>
    <TabNav.Link href="#">Documentation</TabNav.Link>
    <TabNav.Link href="#">Support</TabNav.Link>
  </TabNav>
)
