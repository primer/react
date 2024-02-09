import React from 'react'
import {Meta} from '@storybook/react'
import {ComponentProps} from '../utils/types'
import Pagination from './Pagination'

export default {
  title: 'Components/Pagination/Features',
  component: Pagination,
} as Meta<ComponentProps<typeof Pagination>>

export const LargerPageCountMargin = () => (
  <Pagination pageCount={15} currentPage={5} marginPageCount={4} onPageChange={e => e.preventDefault()} />
)

export const HidePageNumbers = () => (
  <Pagination pageCount={15} currentPage={5} showPages={false} onPageChange={e => e.preventDefault()} />
)

export const HidePageNumbersByViewport = () => (
  <>
    <Pagination pageCount={15} currentPage={5} showPages={{narrow: false}} onPageChange={e => e.preventDefault()} />
    <p>Page numbers are hidden on narrow viewports.</p>
  </>
)

HidePageNumbersByViewport.parameters = {
  viewport: {
    defaultViewport: 'small',
  },
}

export const HigherSurroundingPageCount = () => (
  <Pagination pageCount={15} currentPage={5} surroundingPageCount={4} onPageChange={e => e.preventDefault()} />
)
