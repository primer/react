import React from 'react'

import type {Meta} from '@storybook/react'
import type {ComponentProps} from '../utils/types'
import Pagination from './Pagination'
import {StressTest} from '../utils/StressTest'

export default {
  title: 'StressTests/Components/Pagination',
  component: Pagination,
} as Meta<ComponentProps<typeof Pagination>>

const totalIterations = 500

export const PageUpdate = () => {
  return (
    <StressTest
      title="Pagination Page Update"
      totalIterations={totalIterations}
      renderIteration={count => (
        <Pagination pageCount={totalIterations} currentPage={count + 1} showPages={{narrow: false}} />
      )}
    />
  )
}
