import type {Meta} from '@storybook/react-vite'
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
      componentName="Pagination"
      title="Page update"
      description="Navigation through a large number of pages."
      totalIterations={totalIterations}
      renderIteration={count => (
        <Pagination pageCount={totalIterations} currentPage={count + 1} showPages={{narrow: false}} />
      )}
    />
  )
}
