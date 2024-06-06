import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import {MarkGithubIcon} from '@primer/octicons-react'

import Header from './Header'
import Avatar from '../Avatar'
import Octicon from '../Octicon'

export default {
  title: 'Components/Header',
  component: Header,
} as Meta<typeof Header>

export const Default = () => (
  <Header>
    <Header.Item>
      <Header.Link href="#" sx={{fontSize: 2}}>
        <Octicon icon={MarkGithubIcon} size={32} sx={{mr: 2}} />
        <span>GitHub</span>
      </Header.Link>
    </Header.Item>
    <Header.Item full>Menu</Header.Item>
    <Header.Item sx={{mr: 0}}>
      <Avatar src="https://github.com/octocat.png" size={20} square alt="@octocat" />
    </Header.Item>
  </Header>
)

export const Playground: StoryFn<typeof Header> = args => (
  <Header {...args}>
    <Header.Item>
      <Header.Link href="#" sx={{fontSize: 2}}>
        <Octicon icon={MarkGithubIcon} size={32} sx={{mr: 2}} />
        <span>GitHub</span>
      </Header.Link>
    </Header.Item>
    <Header.Item full>Menu</Header.Item>
    <Header.Item sx={{mr: 0}}>
      <Avatar src="https://github.com/octocat.png" size={20} square alt="@octocat" />
    </Header.Item>
  </Header>
)
