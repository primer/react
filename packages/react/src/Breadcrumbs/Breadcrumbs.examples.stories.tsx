import type {Meta} from '@storybook/react-vite'
import type React from 'react'
import type {ComponentProps} from '../utils/types'
import Breadcrumbs from './Breadcrumbs'
import {BreadcrumbsOverflowMenu} from './BreadcrumbsOverflowMenu'
import {FeatureFlags} from '../FeatureFlags'

export default {
  title: 'Components/Breadcrumbs/Examples',
  component: Breadcrumbs,
} as Meta<ComponentProps<typeof Breadcrumbs>>

export const ExternallyControlled = () => (
  <Breadcrumbs responsive={false}>
    <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Products</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Subcategory</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Item</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Details</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      Current Page
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

export const WithManualOverflow = () => (
  <FeatureFlags flags={{primer_react_breadcrumbs_overflow_menu: true}}>
    <Breadcrumbs responsive={false} overflow="menu">
      <BreadcrumbsOverflowMenu
        items={[
          <Breadcrumbs.Item key="Home" href="#">
            Home
          </Breadcrumbs.Item>,
          <Breadcrumbs.Item key="Products" href="#">
            Products
          </Breadcrumbs.Item>,
          <Breadcrumbs.Item key="Category" href="#">
            Category
          </Breadcrumbs.Item>,
          <Breadcrumbs.Item key="Subcategory" href="#">
            Subcategory
          </Breadcrumbs.Item>,
          <Breadcrumbs.Item key="Item" href="#">
            Item
          </Breadcrumbs.Item>,
          <Breadcrumbs.Item key="Details" href="#">
            Details
          </Breadcrumbs.Item>,
        ]}
      />
      <Breadcrumbs.Item href="#" selected>
        Current Page
      </Breadcrumbs.Item>
    </Breadcrumbs>
  </FeatureFlags>
)
