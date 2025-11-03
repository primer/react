import type {Meta, StoryFn} from '@storybook/react-vite'
import SubNav from './SubNav'
import type {ComponentProps} from '../utils/types'

export default {
  title: 'Components/SubNav',
  component: SubNav,
  subcomponents: {
    'SubNav.Link': SubNav.Link,
  },
} as Meta<ComponentProps<typeof SubNav>>

export const Playground: StoryFn<ComponentProps<typeof SubNav>> = args => (
  <SubNav {...args}>
    <SubNav.Links>
      <SubNav.Link href="#home" selected>
        Home
      </SubNav.Link>
      <SubNav.Link href="#documentation">Documentation</SubNav.Link>
      <SubNav.Link href="#support">Support</SubNav.Link>
    </SubNav.Links>
  </SubNav>
)

Playground.args = {
  'aria-label': 'Main',
}
Playground.argTypes = {
  'aria-label': {
    type: 'string',
  },
}

export const Default = () => (
  <SubNav aria-label="Main">
    <SubNav.Links>
      <SubNav.Link href="#home" selected>
        Home
      </SubNav.Link>
      <SubNav.Link href="#documentation">Documentation</SubNav.Link>
      <SubNav.Link href="#support">Support</SubNav.Link>
    </SubNav.Links>
  </SubNav>
)
