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
// Breadcrumb with 6 items
export const SixItems = () => (
  <Breadcrumbs>
    <Breadcrumbs.Item href="#">First</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Second</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Third</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Fourth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Fifth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Last
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

// Breadcrumb with 8 items
export const EightItems = () => (
  <Breadcrumbs>
    <Breadcrumbs.Item href="#">First</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Second</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Third</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Fourth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Fifth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Sixth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Seventh</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Last
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

// Breadcrumb with 8 items and root hidden
export const EightItemsWithRootHidden = () => (
  <Breadcrumbs hideRoot>
    <Breadcrumbs.Item href="#">First</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Second</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Third</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Fourth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Fifth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Sixth</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Seventh</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Last
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

// Breadcrumb with 3 items in a div that has a max width of 200px
export const ThreeItems = () => (
  <div style={{maxWidth: '200px'}}>
    <Breadcrumbs>
      <Breadcrumbs.Item href="#">First</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Second</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#" selected>
        Last
      </Breadcrumbs.Item>
    </Breadcrumbs>
  </div>
)

// Breadcrumb with 2 items in a div that has a max width of 200px
export const TwoItems = () => (
  <div style={{maxWidth: '200px'}}>
    <Breadcrumbs>
      <Breadcrumbs.Item href="#">First</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#" selected>
        Last
      </Breadcrumbs.Item>
    </Breadcrumbs>
  </div>
)
