import type {StoryFn, Meta} from '@storybook/react-vite'
import UnderlineNav from './UnderlineNav'
import {Button} from '../../Button'

export default {
  title: 'Deprecated/Components/UnderlineNav/Features',
  component: UnderlineNav,
} as Meta<typeof UnderlineNav>

export const Actions: StoryFn<typeof UnderlineNav> = () => (
  <UnderlineNav aria-label="Main" actions={<Button>Click me</Button>}>
    <UnderlineNav.Link href="#home" selected>
      Home
    </UnderlineNav.Link>
    <UnderlineNav.Link href="#documentation">Documentation</UnderlineNav.Link>
    <UnderlineNav.Link href="#support">Support</UnderlineNav.Link>
  </UnderlineNav>
)
