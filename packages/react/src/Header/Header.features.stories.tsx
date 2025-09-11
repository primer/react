import type {Meta} from '@storybook/react-vite'
import {MarkGithubIcon} from '@primer/octicons-react'
import Avatar from '../Avatar'
import Header from './Header'
import classes from './Header.features.stories.module.css'

export default {
  title: 'Components/Header/Features',
  component: Header,
} as Meta<typeof Header>

export const WithFullSizeItem = () => (
  <Header>
    <Header.Item>Item 1</Header.Item>
    <Header.Item full>Item 2</Header.Item>
    <Header.Item className={classes.LastItem}>Item 3</Header.Item>
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
      <Header.Link className={classes.Logo} href="#">
        <MarkGithubIcon className={classes.Icon} size={32} />
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
    <Header.Item className={classes.LastItem}>
      <Avatar src="https://github.com/octocat.png" size={20} square alt="@octocat" />
    </Header.Item>
  </Header>
)
