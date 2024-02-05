import React from 'react'
import {ComponentStory, Meta, StoryFn} from '@storybook/react'
import {UnderlineNav} from './index'
import {UnderlineNavItem} from './UnderlineNavItem'

export default {
  title: 'Components/UnderlineNav/DevOnly',
} as Meta

export const IllegalState = () => {
  return (
    <UnderlineNav aria-label="Repository">
      <UnderlineNav.Item aria-current="page">Code</UnderlineNav.Item>
      <UnderlineNav.Item aria-current="page">Issues</UnderlineNav.Item>
      <UnderlineNav.Item aria-current="page">Pull Requests</UnderlineNav.Item>
    </UnderlineNav>
  )
}

export const PopOverPosition: StoryFn<typeof UnderlineNav> = () => {
  const children = ['Code', 'Pull requests', 'Actions', 'Projects', 'Wiki']
  return (
    <UnderlineNav aria-label="Repository">
      {children.map((child: string, index: number) => (
        <UnderlineNavItem key={index} href="#" aria-current={index === 0 ? 'page' : undefined}>
          {child}
        </UnderlineNavItem>
      ))}
    </UnderlineNav>
  )
}
