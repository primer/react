import React from 'react'
import type {Meta} from '@storybook/react'
import type {ComponentProps} from '../utils/types'
import Breadcrumbs from './Breadcrumbs'

export default {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
} as Meta<ComponentProps<typeof Breadcrumbs>>

export const Default = () => (
  <Breadcrumbs>
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
    <Breadcrumbs.Item href="#">Eleventh</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Twelfth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Thirteenth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Fourteenth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Last
    </Breadcrumbs.Item>
  </Breadcrumbs>
)
