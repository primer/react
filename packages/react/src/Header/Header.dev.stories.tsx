import React from 'react'
import type {Meta} from '@storybook/react'
import {MarkGithubIcon} from '@primer/octicons-react'

import Header from './Header'
import Avatar from '../Avatar'
import Octicon from '../Octicon'

import classes from './Header.dev.module.css'
import {FeatureFlags} from '../FeatureFlags'

export default {
  title: 'Components/Header/Dev',
  component: Header,
} as Meta<typeof Header>

export const WithCss = () => (
  <FeatureFlags
    flags={{
      primer_react_css_modules_staff: true,
      primer_react_css_modules_ga: true,
    }}
  >
    <Header className={classes.HeaderDev}>
      <Header.Item id="github">
        <Header.Link href="#" className={classes.HeaderDevLink}>
          <Octicon icon={MarkGithubIcon} size={32} sx={{mr: 2}} />
          <span>GitHub</span>
        </Header.Link>
      </Header.Item>
      <Header.Item full>Menu</Header.Item>
      <Header.Item className={classes.HeaderDevItem}>
        <Avatar src="https://github.com/octocat.png" size={20} square alt="@octocat" />
      </Header.Item>
    </Header>
  </FeatureFlags>
)

export const WithSx = () => (
  <Header sx={{backgroundColor: 'blue', color: 'white'}}>
    <Header.Item id="github">
      <Header.Link href="#" sx={{fontSize: 3}}>
        <Octicon icon={MarkGithubIcon} size={32} sx={{mr: 2}} />
        <span>GitHub</span>
      </Header.Link>
    </Header.Item>
    <Header.Item full>Menu</Header.Item>
    <Header.Item sx={{mr: 2}}>
      <Avatar src="https://github.com/octocat.png" size={20} square alt="@octocat" />
    </Header.Item>
  </Header>
)

export const WithSxAndCSS = () => (
  <FeatureFlags
    flags={{
      primer_react_css_modules_staff: true,
      primer_react_css_modules_ga: true,
    }}
  >
    <Header className={classes.HeaderDev} sx={{backgroundColor: 'orange', color: 'black'}}>
      <Header.Item id="github">
        <Header.Link href="#" className={classes.HeaderDevLink} sx={{p: 0, color: 'black'}}>
          <Octicon icon={MarkGithubIcon} size={32} sx={{mr: 2}} />
          <span>GitHub</span>
        </Header.Link>
      </Header.Item>
      <Header.Item full>Menu</Header.Item>
      <Header.Item className={classes.HeaderDevItem} sx={{m: 0}}>
        <Avatar src="https://github.com/octocat.png" size={20} square alt="@octocat" />
      </Header.Item>
    </Header>
  </FeatureFlags>
)
