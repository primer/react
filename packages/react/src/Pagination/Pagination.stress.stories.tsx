import React from 'react'

import type {Meta} from '@storybook/react'
import type {ComponentProps} from '../utils/types'
import Pagination from './Pagination'
import {StressTest} from '../utils/StressTest'

export default {
  title: 'Components/Pagination/StressTests',
  component: Pagination,
} as Meta<ComponentProps<typeof Pagination>>

export const PageUpdate = () => {
  return (
    <StressTest
      renderIteration={(count, totalIterations) => (
        <Pagination pageCount={totalIterations} currentPage={count} showPages={{narrow: false}} />
      )}
    />
  )
}
