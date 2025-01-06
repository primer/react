import React from 'react'
import type {Meta} from '@storybook/react'

import Header from './Header'
import Avatar from '../Avatar'
import Octicon from '../Octicon'
import {MarkGithubIcon} from '@primer/octicons-react'

export default {
  title: 'Components/Header/Features',
  component: Header,
} as Meta<typeof Header>

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

export const WithManyItems = () => (
  <Header>
    <Header.Item>
      <Header.Link href="#" sx={{fontSize: 2}}>
        <Octicon icon={MarkGithubIcon} size={32} sx={{mr: 2}} />
        <span>GitHub</span>
      </Header.Link>
    </Header.Item>
    <Header.Item>Item</Header.Item>
    <Header.Item>Item</Header.Item>
    <Header.Item>Item</Header.Item>
    <Header.Item>Item</Header.Item>
    <Header.Item>Item</Header.Item>
    <Header.Item>Item</Header.Item>
    <Header.Item>Item</Header.Item>
    <Header.Item>Item</Header.Item>
    <Header.Item>Item</Header.Item>
    <Header.Item>Item</Header.Item>
    <Header.Item sx={{mr: 0}}>
      <Avatar src="https://github.com/octocat.png" size={20} square alt="@octocat" />
    </Header.Item>
  </Header>
)
