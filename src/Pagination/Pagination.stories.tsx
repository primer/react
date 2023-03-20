import React from 'react'
import {Meta, Story} from '@storybook/react'
import {ComponentProps} from '../utils/types'
import Pagination from './Pagination'

export default {
  title: 'Components/Pagination',
  component: Pagination,
} as Meta<ComponentProps<typeof Pagination>>

export const Default = () => <Pagination pageCount={15} currentPage={2} onPageChange={e => e.preventDefault()} />

export const Playground: Story<ComponentProps<typeof Pagination>> = args => (
  <Pagination onPageChange={e => e.preventDefault()} {...args} />
)

Playground.args = {
  currentPage: 5,
  marginPageCount: 1,
  pageCount: 15,
  showPages: true,
  surroundingPageCount: 2,
}
Playground.argTypes = {
  hrefBuilder: {
    control: false,
    table: {
      disable: true,
    },
  },
  onPageChange: {
    control: false,
    table: {
      disable: true,
    },
  },
  theme: {
    control: false,
    table: {
      disable: true,
    },
  },
}
