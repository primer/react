import {Meta, Story} from '@storybook/react'
import React from 'react'
import {PageLayout} from '../PageLayout'
import {NavList} from './NavList'

const meta: Meta = {
  title: 'Composite components/NavList',
  component: NavList,
  parameters: {
    layout: 'fullscreen'
  }
}

export const Simple: Story = () => (
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

export const SubItems: Story = () => (
  <PageLayout>
    <PageLayout.Pane position="start">
      <NavList>
        <NavList.Item href="#">Item 1</NavList.Item>
        <NavList.Item>
          Item 2
          <NavList.SubNav>
            <NavList.Item href="#" aria-current="page">
              Sub item 1
            </NavList.Item>
            <NavList.Item href="#">Sub item 2</NavList.Item>
          </NavList.SubNav>
        </NavList.Item>
        <NavList.Item href="#">Item 3</NavList.Item>
      </NavList>
    </PageLayout.Pane>
    <PageLayout.Content></PageLayout.Content>
  </PageLayout>
)

export default meta
