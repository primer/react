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
  <Breadcrumbs style={{maxWidth: 300}}>
    <Breadcrumbs.Item href="#">First</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Second</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Third</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Fourth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Fifth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Sixth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Seventh</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Eighth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Ninth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Tenth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Last
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

const breadcrumbItems = [
  {label: 'First', href: '/'},
  {label: 'Second', href: '/'},
  {label: 'Third', href: '/'},
  {label: 'Fourth', href: '/'},
  {label: 'Fifth', href: '/'},
  {label: 'Sixth', href: '/'},
  {label: 'Seventh', href: '/'},
  {label: 'Eighth', href: '/'},
  {label: 'Ninth', href: '/'},
  {label: 'Tenth', href: '/'},
  {label: 'Last', href: '/'},
]

export const Responsive = () => <Breadcrumbs responsive items={breadcrumbItems} />
