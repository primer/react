import type {Meta} from '@storybook/react-vite'
import type React from 'react'
import type {ComponentProps} from '../utils/types'
import Breadcrumbs from './Breadcrumbs'
import {FeatureFlags} from '../FeatureFlags'

export default {
  title: 'Components/Breadcrumbs/Features',
  component: Breadcrumbs,
} as Meta<ComponentProps<typeof Breadcrumbs>>

export const OverflowWrap = () => (
  <Breadcrumbs overflow="wrap">
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

export const OverflowMenuFeatureFlagEnabled = () => (
  <FeatureFlags flags={{primer_react_breadcrumbs_overflow_menu: true}}>
    <Breadcrumbs overflow="menu">
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
  </FeatureFlags>
)

export const OverflowMenuFeatureFlagDisabled = () => (
  <Breadcrumbs overflow="menu">
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

export const OverflowMenuShowRootFeatureFlagDisabled = () => (
  <Breadcrumbs overflow="menu-with-root">
    <Breadcrumbs.Item href="#">github</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Teams</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">Engineering</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">core-productivity</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#">collaboration-workflows-flex</Breadcrumbs.Item>
    <Breadcrumbs.Item href="#" selected>
      global-navigation-reviewers
    </Breadcrumbs.Item>
  </Breadcrumbs>
)

export const OverflowMenuShowRootFeatureFlagEnabled = () => (
  <FeatureFlags flags={{primer_react_breadcrumbs_overflow_menu: true}}>
    <Breadcrumbs overflow="menu-with-root">
      <Breadcrumbs.Item href="#">github</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Teams</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Engineering</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">core-productivity</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">collaboration-workflows-flex</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#" selected>
        global-navigation-reviewers
      </Breadcrumbs.Item>
    </Breadcrumbs>
  </FeatureFlags>
)

export const SpaciousVariantWithOverflowMenu = () => (
  <FeatureFlags flags={{primer_react_breadcrumbs_overflow_menu: true}}>
    <Breadcrumbs overflow="menu" variant="spacious">
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
  </FeatureFlags>
)

export const SpaciousVariantWithOverflowWrap = () => (
  <Breadcrumbs variant="spacious">
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
