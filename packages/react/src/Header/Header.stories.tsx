import type {Meta, StoryFn} from '@storybook/react-vite'
import {MarkGithubIcon} from '@primer/octicons-react'
import Header from './Header'
import Avatar from '../Avatar'
import classes from './Header.stories.module.css'
import Octicon from '../Octicon'

export default {
  title: 'Components/Header',
  component: Header,
} as Meta<typeof Header>

export const Default = () => (
  <Header>
    <Header.Item>
      <Header.Link href="#" className={classes.HeaderLink}>
        <MarkGithubIcon className={classes.Icon} size={32} />
        <span>GitHub</span>
      </Header.Link>
    </Header.Item>
    <Header.Item full>Menu</Header.Item>
    <Header.Item className={classes.AvatarContainer}>
      <Avatar src="https://github.com/octocat.png" size={20} square alt="@octocat" />
    </Header.Item>
  </Header>
)

export const Playground: StoryFn<typeof Header> = args => (
  <Header {...args}>
    <Header.Item>
      <Header.Link className={classes.HeaderLink} href="#">
        <MarkGithubIcon className={classes.Icon} size={32} />
        <span>GitHub</span>
      </Header.Link>
    </Header.Item>
    <Header.Item full>Menu</Header.Item>
    <Header.Item className={classes.AvatarContainer}>
      <Avatar src="https://github.com/octocat.png" size={20} square alt="@octocat" />
    </Header.Item>
  </Header>
)
