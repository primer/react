import React from 'react'
import type {Meta} from '@storybook/react'
import BranchName from './BranchName'
import {Stack} from '../Stack'

export default {
  title: 'Components/BranchName',
  component: BranchName,
} as Meta<typeof BranchName>

export const Default = () => (
  <Stack align="start">
    <BranchName href="#">branch_name</BranchName>
    <BranchName as="span">branch_name as span</BranchName>
  </Stack>
)
