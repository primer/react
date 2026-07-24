import type {Meta, StoryObj} from '@storybook/react-vite'
import {Pagination} from './Pagination'

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  args: {currentPage: 4, pageCount: 12},
} satisfies Meta<typeof Pagination>
export default meta
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {args: {surroundingPageCount: 1, marginPageCount: 2}}
export const Responsive: StoryObj<typeof meta> = {args: {showPages: {narrow: false, regular: true}}}
