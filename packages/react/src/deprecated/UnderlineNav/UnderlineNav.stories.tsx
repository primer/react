import type {StoryFn, Meta} from '@storybook/react-vite'
import type {UnderlineNavProps} from './UnderlineNav'
import UnderlineNav from './UnderlineNav'

export default {
  title: 'Deprecated/Components/UnderlineNav',
  component: UnderlineNav,
} as Meta<typeof UnderlineNav>

export const Default = () => (
  <UnderlineNav aria-label="Main">
    <UnderlineNav.Link href="#home" selected>
      Home
    </UnderlineNav.Link>
    <UnderlineNav.Link href="#documentation">Documentation</UnderlineNav.Link>
    <UnderlineNav.Link href="#support">Support</UnderlineNav.Link>
  </UnderlineNav>
)

export const Playground: StoryFn<typeof UnderlineNav> = (args: UnderlineNavProps) => (
  <UnderlineNav {...args}>
    <UnderlineNav.Link href="#home" selected>
      Home
    </UnderlineNav.Link>
    <UnderlineNav.Link href="#documentation">Documentation</UnderlineNav.Link>
    <UnderlineNav.Link href="#support">Support</UnderlineNav.Link>
  </UnderlineNav>
)

Playground.args = {
  actions: undefined,
  align: 'right',
  full: false,
  label: 'Underline Nav Label',
}

Playground.argTypes = {
  actions: {
    controls: false,
    table: {
      disable: true,
    },
  },
  align: {
    type: 'string',
  },
  full: {
    controls: {
      type: 'boolean',
    },
  },
  label: {
    type: 'string',
  },
}
