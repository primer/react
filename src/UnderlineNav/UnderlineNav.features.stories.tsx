import {ComponentStory, Meta} from '@storybook/react'
import React from 'react'
import {Button} from '../Button'
import UnderlineNav from './UnderlineNav'

export default {
  title: 'Components/UnderlineNav/Features',
  component: UnderlineNav,
} as Meta<typeof UnderlineNav>

export const Actions: ComponentStory<typeof UnderlineNav> = () => (
  <UnderlineNav aria-label="Main" actions={<Button>Click me</Button>}>
    <UnderlineNav.Link href="#home" selected>
      Home
    </UnderlineNav.Link>
    <UnderlineNav.Link href="#documentation">Documentation</UnderlineNav.Link>
    <UnderlineNav.Link href="#support">Support</UnderlineNav.Link>
  </UnderlineNav>
)
