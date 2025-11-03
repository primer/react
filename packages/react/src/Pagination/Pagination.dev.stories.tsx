import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import Pagination from './Pagination'

export default {
  title: 'Components/Pagination/Dev',
  component: Pagination,
} as Meta<ComponentProps<typeof Pagination>>

export const DevDefault = () => (
  <Pagination pageCount={15} currentPage={2} onPageChange={e => e.preventDefault()} showPages={{narrow: false}} />
)
