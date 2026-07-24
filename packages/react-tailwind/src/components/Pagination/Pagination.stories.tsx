import type {Meta, StoryObj} from '@storybook/react-vite'
import {Pagination} from './Pagination'

const meta = {
  title: 'React Tailwind/Navigation/Pagination',
  component: Pagination,
  args: {currentPage: 2, pageCount: 15, showPages: {narrow: false}},
} satisfies Meta<typeof Pagination>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {
  args: {currentPage: 5, pageCount: 15, showPages: true, surroundingPageCount: 2, marginPageCount: 1},
}
export const Responsive: Story = {args: {showPages: {narrow: false, regular: true}}}
