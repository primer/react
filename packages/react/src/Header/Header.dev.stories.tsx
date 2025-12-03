import type {Meta} from '@storybook/react-vite'
import {MarkGithubIcon} from '@primer/octicons-react'

import Header from './Header'
import Avatar from '../Avatar'

import classes from './Header.dev.module.css'

export default {
  title: 'Components/Header/Dev',
  component: Header,
} as Meta<typeof Header>

export const WithCss = () => (
  <Header className={classes.HeaderDev}>
    <Header.Item id="github">
      <Header.Link href="#" className={classes.HeaderDevLink}>
        <MarkGithubIcon className={classes.Icon} size={32} />
        <span>GitHub</span>
      </Header.Link>
    </Header.Item>
    <Header.Item full>Menu</Header.Item>
    <Header.Item className={classes.HeaderDevItem}>
      <Avatar src="https://github.com/octocat.png" size={20} square alt="@octocat" />
    </Header.Item>
  </Header>
)
