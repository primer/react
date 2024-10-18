import React from 'react'
import type {Meta} from '@storybook/react'
import {BranchName} from '..'
import {sxOverrideTestStyles} from '../utils/story-helpers'

export default {
  title: 'Components/BranchName/Dev',
  component: BranchName,
} as Meta<typeof BranchName>

export const SxPropStressTest = () => (
  <BranchName sx={sxOverrideTestStyles} href="#">
    branch_name
  </BranchName>
)
