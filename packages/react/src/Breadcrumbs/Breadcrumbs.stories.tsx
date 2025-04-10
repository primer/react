import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import type {ComponentProps} from 'react'
import Breadcrumbs from './Breadcrumbs'

const meta: Meta<ComponentProps<typeof Breadcrumbs>> = {
  title: 'Components/Breadcrumbs',
}

export default meta

export const Playground: StoryFn<typeof Breadcrumbs> = args => (
  <Breadcrumbs>
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Team
    </Breadcrumbs.Item>
  </Breadcrumbs>
)
Playground.args = {}

export const Default = () => (
  <Breadcrumbs>
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Team
    </Breadcrumbs.Item>
  </Breadcrumbs>
)
