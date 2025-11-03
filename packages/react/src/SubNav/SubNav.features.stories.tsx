import type {Meta} from '@storybook/react-vite'
import SubNav from './SubNav'
import type {ComponentProps} from '../utils/types'

export default {
  title: 'Components/SubNav/Features',
  component: SubNav,
  subcomponents: {
    'SubNav.Link': SubNav.Link,
  },
} as Meta<ComponentProps<typeof SubNav>>

export const Selected = () => (
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
