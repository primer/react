import type {Meta, StoryObj} from '@storybook/react-vite'
import {Pagination} from './Pagination'

const meta = {
  title: 'React Tailwind/Navigation/Pagination',
  component: Pagination,
  args: {currentPage: 4, pageCount: 12},
} satisfies Meta<typeof Pagination>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {surroundingPageCount: 1, marginPageCount: 2}}
export const Responsive: Story = {args: {showPages: {narrow: false, regular: true}}}
