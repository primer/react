import React from 'react'
import {fireEvent, render, screen, within} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {Pagination} from './Pagination'
import {buildPaginationModel} from './model'

describe('Pagination', () => {
  it('renders labelled navigation and reports page changes', () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={2} pageCount={4} onPageChange={onPageChange} />)
    expect(screen.getByRole('navigation', {name: 'Pagination'})).toBeVisible()
    expect(screen.getByRole('link', {name: 'Page 2'})).toHaveAttribute('aria-current', 'page')
    fireEvent.click(screen.getByRole('link', {name: 'Page 3'}))
    expect(onPageChange).toHaveBeenCalledWith(expect.anything(), 3)
  })

  it('keeps consumer navigation labels, omits pages when requested, and does not change disabled controls', () => {
    const onPageChange = vi.fn()
    const {container} = render(
      <Pagination
        aria-label="Search results"
        currentPage={1}
        pageCount={4}
        onPageChange={onPageChange}
        showPages={false}
      />,
    )
    const pagination = within(container)
    expect(pagination.getByRole('navigation', {name: 'Search results'})).toBeVisible()
    expect(pagination.queryByRole('link', {name: 'Page 1'})).not.toBeInTheDocument()
    fireEvent.click(pagination.getByLabelText('Previous page'))
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('builds contiguous page windows with ellipses and supports zero margins', () => {
    expect(buildPaginationModel(15, 9, true, 1, 2).map(page => `${page.type}:${page.number}`)).toEqual([
      'previous:8',
      'page:1',
      'ellipsis:2',
      'page:7',
      'page:8',
      'page:9',
      'page:10',
      'page:11',
      'ellipsis:12',
      'page:15',
      'next:10',
    ])
    expect(buildPaginationModel(50, 3, true, 0, 0).map(page => `${page.type}:${page.number}`)).toEqual([
      'previous:2',
      'ellipsis:1',
      'page:3',
      'ellipsis:4',
      'next:4',
    ])
  })
})
