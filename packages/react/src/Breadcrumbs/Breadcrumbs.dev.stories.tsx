import React from 'react'
import type {Meta} from '@storybook/react'
import {Breadcrumbs} from '..'
import {sxOverrideTestStyles} from '../utils/story-helpers'

export default {
  title: 'Components/Breadcrumbs/Dev',
  component: Breadcrumbs,
} as Meta<typeof Breadcrumbs>

export const SxPropStressTest = () => (
  <Breadcrumbs sx={sxOverrideTestStyles}>
    <Breadcrumbs.Item sx={sxOverrideTestStyles} href="#">
      Home
    </Breadcrumbs.Item>
    <Breadcrumbs.Item sx={sxOverrideTestStyles} href="#">
      About
    </Breadcrumbs.Item>
    <Breadcrumbs.Item sx={sxOverrideTestStyles} href="#" selected>
      Team
    </Breadcrumbs.Item>
  </Breadcrumbs>
)
