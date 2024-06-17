import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import type {ComponentProps} from '../utils/types'
import Pagination from './Pagination'

export default {
  title: 'Components/Pagination',
  component: Pagination,
} as Meta<ComponentProps<typeof Pagination>>

const parseShowPagesArg = (value: boolean | string) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (value === 'hide at narrow') {
    return {narrow: false}
  }

  if (value === 'hide at regular') {
    return {regular: false}
  }

  if (value === 'hide at wide') {
    return {wide: false}
  }
}

export const Default = () => (
  <Pagination pageCount={15} currentPage={2} onPageChange={e => e.preventDefault()} showPages={{narrow: false}} />
)

export const Playground: StoryFn<ComponentProps<typeof Pagination>> = ({showPages, ...args}) => {
  return (
    <Pagination
      onPageChange={e => e.preventDefault()}
      showPages={parseShowPagesArg(showPages as boolean | string)}
      {...args}
    />
  )
}

Playground.args = {
  currentPage: 5,
  marginPageCount: 1,
  pageCount: 15,
  showPages: true,
  surroundingPageCount: 2,
}
Playground.argTypes = {
  showPages: {
    control: {
      type: 'radio',
    },
    options: [true, false, 'hide at narrow', 'hide at regular', 'hide at wide'],
  },
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
