import type {Meta, StoryFn} from '@storybook/react-vite'
import React from 'react'
import {PageLayout} from '../PageLayout'
import {NavList} from './NavList'

const meta: Meta = {
  title: 'Components/NavList',
  component: NavList,
  parameters: {
    layout: 'fullscreen',
  },
}

export const Default: StoryFn = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Item href="#" aria-current="page">
          Item 1
        </NavList.Item>
        <NavList.Item href="#">Item 2</NavList.Item>
        <NavList.Item href="#">Item 3</NavList.Item>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

export default meta
