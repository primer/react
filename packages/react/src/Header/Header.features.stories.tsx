import React from 'react'
import {ComponentMeta} from '@storybook/react'

import Header from './Header'

export default {
  title: 'Components/Header/Features',
  component: Header,
} as ComponentMeta<typeof Header>

export const WithFullSizeItem = () => (
  <Header>
    <Header.Item>Item 1</Header.Item>
    <Header.Item full>Item 2</Header.Item>
    <Header.Item sx={{mr: 0}}>Item 3</Header.Item>
  </Header>
)

export const WithLinks = () => (
  <Header>
    <Header.Item>
      <Header.Link href="#">About</Header.Link>
    </Header.Item>
    <Header.Item>
      <Header.Link href="#">Releases</Header.Link>
    </Header.Item>
    <Header.Item>
      <Header.Link href="#">Team</Header.Link>
    </Header.Item>
  </Header>
)
