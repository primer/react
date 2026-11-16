import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {Pagination} from './Pagination'

const meta = {
  title: 'React Tailwind/Navigation/Pagination/Features',
  component: Pagination,
} satisfies Meta<typeof Pagination>
export default meta
type Story = StoryObj<typeof meta>

export const LargerPageCountMargin: Story = {
  args: {currentPage: 5, pageCount: 15, marginPageCount: 4},
}
export const HidePageNumbers: Story = {args: {currentPage: 5, pageCount: 15, showPages: false}}
export const HidePageNumbersByViewport: Story = {
  args: {currentPage: 5, pageCount: 15, showPages: {narrow: false}},
  render: args => (
    <>
      <Pagination {...args} />
      <p>Page numbers are hidden on narrow viewports.</p>
    </>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'small',
    },
  },
}
export const HigherSurroundingPageCount: Story = {args: {currentPage: 5, pageCount: 15, surroundingPageCount: 4}}
export const RenderLinks: Story = {
  args: {currentPage: 2, pageCount: 15},
  render: function RenderLinks() {
    const [page, setPage] = useState(2)
    return (
      <Pagination
        currentPage={page}
        pageCount={15}
        onPageChange={(event, next) => {
          event.preventDefault()
          setPage(next)
        }}
        renderPage={({number, onPageSelect: _onPageSelect, pageType: _pageType, ...props}) => (
          // eslint-disable-next-line jsx-a11y/anchor-has-content -- Pagination supplies children through the render props.
          <a {...props} href={`#${number}`} />
        )}
      />
    )
  },
}
