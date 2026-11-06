import type {Meta, StoryObj} from '@storybook/react-vite'
import {Pagination} from './Pagination'

const meta = {
  title: 'React Tailwind/Navigation/Pagination',
  component: Pagination,
  args: {currentPage: 2, pageCount: 15, showPages: {narrow: false}},
  argTypes: {
    currentPage: {control: {type: 'number', min: 1, step: 1}},
    pageCount: {control: {type: 'number', min: 1, step: 1}},
    showPages: {control: 'boolean'},
    surroundingPageCount: {control: {type: 'number', min: 0, step: 1}},
    marginPageCount: {control: {type: 'number', min: 0, step: 1}},
  },
} satisfies Meta<typeof Pagination>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {
  args: {
    currentPage: 5,
    pageCount: 15,
    showPages: true,
    surroundingPageCount: 2,
    marginPageCount: 1,
  },
}
export const Responsive: Story = {
  args: {showPages: {narrow: false, regular: true}},
}
