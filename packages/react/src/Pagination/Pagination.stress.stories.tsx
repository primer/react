import React from 'react'
import type {Meta} from '@storybook/react'
import type {ComponentProps} from '../utils/types'
import Pagination from './Pagination'

export default {
  title: 'Components/Pagination/StressTests',
  component: Pagination,
} as Meta<ComponentProps<typeof Pagination>>

export const Default = () => (
  <Pagination pageCount={15} currentPage={5} marginPageCount={4} onPageChange={e => e.preventDefault()} />
)
