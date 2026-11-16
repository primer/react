import {useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {Pagination} from './Pagination'

const meta = {
  title: 'React Tailwind/Navigation/Pagination/Examples',
  component: Pagination,
  args: {currentPage: 1, pageCount: 8},
} satisfies Meta<typeof Pagination>
export default meta
type Story = StoryObj<typeof meta>

export const SearchResults: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    return (
      <div>
        <p aria-live="polite">Showing results for page {page}</p>
        <Pagination
          pageCount={8}
          currentPage={page}
          onPageChange={(event, nextPage) => {
            event.preventDefault()
            setPage(nextPage)
          }}
        />
      </div>
    )
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('link', {name: 'Page 3'}))
    await expect(canvas.getByText('Showing results for page 3')).toBeVisible()
  },
}
