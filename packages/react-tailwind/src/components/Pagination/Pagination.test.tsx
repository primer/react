import React from 'react'
import {act, fireEvent, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {type PageProps, Pagination} from './Pagination'
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
    const previousPage = pagination.getByLabelText('Previous page')
    expect(previousPage).toHaveClass('primer:mr-0')
    fireEvent.click(previousPage)
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('renders page links for responsive visibility values', () => {
    const {container} = render(<Pagination currentPage={2} pageCount={4} showPages={{narrow: false, regular: true}} />)

    expect(within(container).getByRole('link', {name: 'Page 2'})).toHaveClass('primer:hidden', 'primer:md:inline-flex')
    expect(within(container).getByRole('link', {name: 'Previous page'})).toHaveClass('primer:mr-0', 'primer:md:mr-1')
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
    expect(buildPaginationModel(10, 5, true, 1, 2).map(page => `${page.type}:${page.number}`)).toEqual([
      'previous:4',
      'page:1',
      'page:2',
      'page:3',
      'page:4',
      'page:5',
      'page:6',
      'page:7',
      'ellipsis:8',
      'page:10',
      'next:6',
    ])
  })

  it('does not pass React keys to custom page renderers', () => {
    const renderPage = vi.fn((props: PageProps) => <a href={props.href}>{props.children}</a>)
    render(<Pagination currentPage={2} pageCount={4} renderPage={renderPage} />)

    expect(renderPage).toHaveBeenCalled()
    for (const [props] of renderPage.mock.calls) {
      expect(props).not.toHaveProperty('key')
    }
  })

  it('supports composed content and custom selection controls', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        currentPage={1}
        pageCount={3}
        onPageChange={onPageChange}
        renderPage={({children, onPageSelect}) => (
          <button type="button" onClick={onPageSelect}>
            {children}
          </button>
        )}
      >
        <span>Page range</span>
      </Pagination>,
    )

    expect(screen.getByText('Page range')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', {name: '2'}))
    expect(onPageChange).toHaveBeenCalledWith(expect.anything(), 2)
  })

  it('preserves directional controls and numbered-page identity across controlled page changes', () => {
    const onPageChange = vi.fn()
    const {rerender} = render(<Pagination currentPage={2} pageCount={6} onPageChange={onPageChange} />)
    const previous = screen.getByRole('link', {name: 'Previous page'})
    const next = screen.getByRole('link', {name: 'Next page'})
    const pageThree = screen.getByRole('link', {name: 'Page 3'})
    act(() => next.focus())

    rerender(<Pagination currentPage={3} pageCount={6} onPageChange={onPageChange} />)

    expect(screen.getByRole('link', {name: 'Previous page'})).toBe(previous)
    expect(screen.getByRole('link', {name: 'Next page'})).toBe(next)
    expect(screen.getByRole('link', {name: 'Page 3'})).toBe(pageThree)
    expect(next).toHaveFocus()
    expect(next).toHaveAttribute('href', '#4')
    expect(pageThree).toHaveAttribute('aria-current', 'page')

    rerender(<Pagination currentPage={6} pageCount={6} onPageChange={onPageChange} />)

    expect(screen.getByLabelText('Next page')).toBe(next)
    expect(next).toHaveAttribute('aria-disabled', 'true')
    expect(next).not.toHaveAttribute('href')
    fireEvent.click(next)
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('retains a custom directional link while the consumer guards a pending request', async () => {
    const user = userEvent.setup()
    const onRequest = vi.fn()

    function AsyncPagination() {
      const [currentPage, setCurrentPage] = React.useState(2)
      const [pending, setPending] = React.useState(false)
      return (
        <>
          <Pagination
            currentPage={currentPage}
            pageCount={5}
            onPageChange={(event, page) => {
              event.preventDefault()
              if (pending) return
              onRequest(page)
              setPending(true)
              setCurrentPage(page)
            }}
            renderPage={({number: _number, pageType: _pageType, onPageSelect: _onPageSelect, ...props}) =>
              props.href ? (
                <a {...props} aria-disabled={pending || undefined}>
                  {props.children}
                </a>
              ) : (
                <span role="link" aria-label={props['aria-label']} aria-disabled="true">
                  {props.children}
                </span>
              )
            }
          />
          <button type="button" onClick={() => setPending(false)}>
            Finish request
          </button>
        </>
      )
    }

    render(<AsyncPagination />)
    const previous = screen.getByRole('link', {name: 'Previous page'})
    const next = screen.getByRole('link', {name: 'Next page'})
    act(() => next.focus())
    await user.keyboard('{Enter}')

    expect(onRequest).toHaveBeenCalledExactlyOnceWith(3)
    expect(screen.getByRole('link', {name: 'Next page'})).toBe(next)
    expect(next).toHaveFocus()
    expect(next).toHaveAttribute('href', '#4')
    expect(next).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('link', {name: 'Page 3'})).toHaveAttribute('aria-current', 'page')
    await user.keyboard('{Enter}')
    expect(onRequest).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', {name: 'Finish request'}))
    expect(next).toHaveFocus()
    expect(next).not.toHaveAttribute('aria-disabled')
    await user.keyboard('{Enter}')
    expect(onRequest).toHaveBeenLastCalledWith(4)
    fireEvent.click(screen.getByRole('button', {name: 'Finish request'}))
    await user.keyboard('{Enter}')
    expect(onRequest).toHaveBeenLastCalledWith(5)
    expect(screen.getByRole('link', {name: 'Previous page'})).toBe(previous)
    const disabledNext = screen.getByRole('link', {name: 'Next page'})
    expect(disabledNext).not.toBe(next)
    expect(disabledNext).toHaveAttribute('aria-disabled', 'true')
    expect(disabledNext).not.toHaveAttribute('href')
    fireEvent.click(disabledNext)
    expect(onRequest).toHaveBeenCalledTimes(3)
  })
})
