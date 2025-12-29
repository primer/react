import {page} from 'vitest/browser'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {Pagination} from '../Pagination'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Table.Pagination', () => {
  beforeEach(async () => {
    await page.viewport(1400, 728)
  })

  it('should render a navigation landmark with an accessible name provided by `aria-label`', () => {
    render(<Pagination aria-label="Pagination" totalCount={100} />)
    expect(
      screen.getByRole('navigation', {
        name: 'Pagination',
      }),
    ).toBeInTheDocument()
  })

  it('should set the initial selected page to the first page', () => {
    render(<Pagination aria-label="Pagination" totalCount={100} />)
    expect(getCurrentPage()).toEqual(getFirstPage())
  })

  it('should initialize `pageIndex` to `defaultPageIndex`', () => {
    render(<Pagination aria-label="Pagination" defaultPageIndex={3} pageSize={25} totalCount={100} />)
    expect(getCurrentPage()).toEqual(getLastPage())
  })

  it('should select the correct page with `defaultPageIndex`', () => {
    render(<Pagination aria-label="Pagination" defaultPageIndex={4} pageSize={10} totalCount={100} />)
    const expectedPage = getPages().filter(p => p.textContent.includes('5'))[0]
    expect(getCurrentPage()).toEqual(expectedPage)
  })

  it('should show the expected steps when `defaultPageIndex` is provided', () => {
    render(<Pagination aria-label="Pagination" defaultPageIndex={6} pageSize={10} totalCount={100} />)
    const pages = getPages().map(p => p.textContent.replace(/[a-z]|\s+/gi, ''))
    expect(pages).toEqual(['1…', '4', '5', '6', '7', '8', '9', '10'])
  })

  it('should warn if `defaultPageIndex` is not a valid `pageIndex`', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<Pagination aria-label="Pagination" defaultPageIndex={4} pageSize={25} totalCount={100} />)
    expect(spy).toHaveBeenCalledWith(
      'Warning:',
      expect.stringMatching(
        // eslint-disable-next-line github/unescaped-html-literal
        '<Pagination> expected `defaultPageIndex` to be less than the total number of pages. Instead, received a `defaultPageIndex` of 4 with 4 total pages.',
      ),
    )
  })

  it('should set the `id` prop on the rendered navigation landmark', () => {
    render(<Pagination aria-label="Test label" id="test-id" totalCount={100} />)
    expect(
      screen.getByRole('navigation', {
        name: 'Test label',
      }),
    ).toHaveAttribute('id', 'test-id')
  })

  describe('with one page', () => {
    it('should only display one page', () => {
      render(<Pagination aria-label="Test label" pageSize={25} totalCount={25} />)

      expect(getPages()).toHaveLength(1)
      expect(getCurrentPage()).toEqual(getPage(0))
      expect(getPageRange()).toEqual('1 through 25 of 25')
    })

    it('should not call `onChange` when a page or action is interacted with', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<Pagination aria-label="Test label" onChange={onChange} pageSize={25} totalCount={25} />)

      expect(getPages()).toHaveLength(1)
      expect(getCurrentPage()).toEqual(getPage(0))
      expect(getPageRange()).toEqual('1 through 25 of 25')

      await user.click(getPage(0))
      expect(onChange).not.toHaveBeenCalled()

      await user.click(getNextPage())
      expect(onChange).not.toHaveBeenCalled()

      await user.click(getPreviousPage())
      expect(onChange).not.toHaveBeenCalled()
    })

    it('should rerender many pages correctly', async () => {
      // Suppress act warnings from async state updates in the Announce component
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const onChange = vi.fn()

      const {rerender, unmount} = render(
        <Pagination aria-label="Test label" onChange={onChange} defaultPageIndex={0} pageSize={25} totalCount={25} />,
      )
      expect(getPages()).toHaveLength(1)
      expect(getCurrentPage()).toEqual(getPage(0))
      expect(getPageRange()).toEqual('1 through 25 of 25')

      rerender(
        <Pagination onChange={onChange} aria-label="Test label" defaultPageIndex={2} pageSize={5} totalCount={300} />,
      )
      expect(getPageRange()).toEqual('11 through 15 of 300')
      expect(getCurrentPage()).toEqual(getPage(2))
      expect(getInvalidPages()).toHaveLength(0)
      expect(onChange).toHaveBeenCalledWith({
        pageIndex: 2,
      })
      // Unmount before restoring to prevent late async callbacks
      unmount()
      spy.mockRestore()
    })
  })

  describe('with two pages', () => {
    it('should display two pages', () => {
      render(<Pagination aria-label="Test label" pageSize={25} totalCount={50} />)

      expect(getPages()).toHaveLength(2)
      expect(getCurrentPage()).toEqual(getPage(0))
      expect(getPageRange()).toEqual('1 through 25 of 50')
    })

    it('should display two pages with correct range when totalCount is one plus pageSize', () => {
      render(<Pagination aria-label="Test label" pageSize={25} totalCount={26} />)

      expect(getPages()).toHaveLength(2)
      expect(getCurrentPage()).toEqual(getPage(0))
      expect(getPageRange()).toEqual('1 through 25 of 26')
    })

    it('should call `onChange` when clicking on pages', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<Pagination aria-label="Test label" onChange={onChange} pageSize={25} totalCount={50} />)

      await user.click(getPage(1))
      expect(onChange).toHaveBeenCalledWith({
        pageIndex: 1,
      })
      expect(getPageRange()).toEqual('26 through 50 of 50')

      await user.click(getPage(0))
      expect(onChange).toHaveBeenCalledWith({
        pageIndex: 0,
      })
      expect(getPageRange()).toEqual('1 through 25 of 50')
    })

    it('should rerender pager with correct page highlighted when clicking on pages and defaultPageIndex set', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(
        <Pagination aria-label="Test label" onChange={onChange} defaultPageIndex={3} pageSize={25} totalCount={200} />,
      )

      expect(getPageRange()).toEqual('76 through 100 of 200')
      expect(getCurrentPage()).toEqual(getPage(3))

      await user.click(getPage(1))
      expect(onChange).toHaveBeenCalledWith({
        pageIndex: 1,
      })
      expect(getPageRange()).toEqual('26 through 50 of 200')
      expect(getCurrentPage()).toEqual(getPage(1))

      await user.click(getPage(0))
      expect(onChange).toHaveBeenCalledWith({
        pageIndex: 0,
      })
      expect(getPageRange()).toEqual('1 through 25 of 200')
      expect(getCurrentPage()).toEqual(getPage(0))
    })

    it('should call `onChange` when using the keyboard to interact with pages', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<Pagination aria-label="Test label" onChange={onChange} pageSize={25} totalCount={50} />)

      await user.tab()
      expect(getPreviousPage()).toHaveFocus()

      await user.tab()
      expect(getFirstPage()).toHaveFocus()

      await user.tab()
      expect(getPage(1)).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(onChange).toHaveBeenCalledWith({
        pageIndex: 1,
      })
      expect(getPageRange()).toEqual('26 through 50 of 50')

      await user.tab({shift: true})
      expect(getPage(0)).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(onChange).toHaveBeenCalledWith({
        pageIndex: 0,
      })
      expect(getPageRange()).toEqual('1 through 25 of 50')
    })

    it('should call `onChange` when clicking on previous or next', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<Pagination aria-label="Test label" onChange={onChange} pageSize={25} totalCount={50} />)

      await user.click(getPreviousPage())
      expect(onChange).not.toHaveBeenCalled()

      await user.click(getNextPage())
      expect(onChange).toHaveBeenCalledWith({
        pageIndex: 1,
      })

      await user.click(getPreviousPage())
      expect(onChange).toHaveBeenCalledWith({
        pageIndex: 0,
      })
    })

    it('should rerender pager with correct page highlighted when clicking on previous or next and defaultPageIndex set', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(
        <Pagination aria-label="Test label" onChange={onChange} defaultPageIndex={3} pageSize={25} totalCount={200} />,
      )

      expect(getPageRange()).toEqual('76 through 100 of 200')

      await user.click(getNextPage())
      expect(onChange).toHaveBeenCalledWith({
        pageIndex: 4,
      })
      expect(getPageRange()).toEqual('101 through 125 of 200')
      expect(getCurrentPage()).toEqual(getPage(4))

      await user.click(getPreviousPage())
      expect(onChange).toHaveBeenCalledWith({
        pageIndex: 3,
      })
      expect(getPageRange()).toEqual('76 through 100 of 200')
      expect(getCurrentPage()).toEqual(getPage(3))
    })

    it('should call `onChange` when using the keyboard to interact with previous or next', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(<Pagination aria-label="Test label" onChange={onChange} pageSize={25} totalCount={50} />)

      await user.tab()
      expect(getPreviousPage()).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(onChange).not.toHaveBeenCalled()

      await user.tab()
      await user.tab()
      await user.tab()
      expect(getNextPage()).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(onChange).toHaveBeenCalledWith({
        pageIndex: 1,
      })

      await user.tab({shift: true})
      await user.tab({shift: true})
      await user.tab({shift: true})
      expect(getPreviousPage()).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(onChange).toHaveBeenCalledWith({
        pageIndex: 0,
      })
    })

    it('should rerender many pages correctly', async () => {
      // Suppress act warnings from async state updates in the Announce component
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const onChange = vi.fn()

      const {rerender, unmount} = render(
        <Pagination aria-label="Test label" onChange={onChange} defaultPageIndex={1} pageSize={25} totalCount={50} />,
      )
      expect(getPages()).toHaveLength(2)
      expect(getCurrentPage()).toEqual(getPage(1))
      expect(getPageRange()).toEqual('26 through 50 of 50')

      rerender(
        <Pagination aria-label="Test label" onChange={onChange} defaultPageIndex={0} pageSize={5} totalCount={300} />,
      )
      expect(getPageRange()).toEqual('1 through 5 of 300')
      expect(getCurrentPage()).toEqual(getPage(0))
      expect(getInvalidPages()).toHaveLength(0)
      expect(onChange).toHaveBeenCalledWith({
        pageIndex: 0,
      })
      // Unmount before restoring to prevent late async callbacks
      unmount()
      spy.mockRestore()
    })
  })

  describe('with three or more pages', () => {
    it('should have trailing truncation if there are more than two pages between the last page and the last visible page', () => {
      render(<Pagination aria-label="Test label" pageSize={10} totalCount={100} />)

      const lastPage = getLastPage()
      const previousStep = getPreviousStep(lastPage)

      expect(previousStep).toHaveAttribute('aria-hidden', 'true')
      expect(previousStep).toHaveTextContent('…')
    })

    it('should have leading truncation if there are more than two pages between the first page and the first visible page', () => {
      render(<Pagination aria-label="Test label" defaultPageIndex={9} pageSize={10} totalCount={100} />)

      const firstPage = getFirstPage()
      const nextStep = getNextStep(firstPage)

      expect(nextStep).toHaveAttribute('aria-hidden', 'true')
      expect(nextStep).toHaveTextContent('…')
    })

    it('should have leading and trailing truncation if there are more than two pages between visible pages and first and last pages', () => {
      render(<Pagination aria-label="Test label" defaultPageIndex={49} pageSize={10} totalCount={1000} />)

      const firstPage = getFirstPage()
      const nextStep = getNextStep(firstPage)

      expect(nextStep).toHaveAttribute('aria-hidden', 'true')
      expect(nextStep).toHaveTextContent('…')

      const lastPage = getLastPage()
      const previousStep = getPreviousStep(lastPage)

      expect(previousStep).toHaveAttribute('aria-hidden', 'true')
      expect(previousStep).toHaveTextContent('…')
    })

    it('should not have more than 7 pages when leading and trailing truncation are present', () => {
      render(<Pagination aria-label="Test label" defaultPageIndex={49} pageSize={10} totalCount={1000} />)
      const pages = getPages()
      expect(pages).toHaveLength(7)
    })
  })

  it('should rerender many pages correctly', async () => {
    // Suppress act warnings from async state updates in the Announce component
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onChange = vi.fn()
    const {rerender, unmount} = render(
      <Pagination aria-label="Test label" onChange={onChange} defaultPageIndex={1} pageSize={10} totalCount={1000} />,
    )
    expect(getPages()).toHaveLength(8)
    expect(getCurrentPage()).toEqual(getPage(1))
    expect(getPageRange()).toEqual('11 through 20 of 1000')

    rerender(
      <Pagination aria-label="Test label" onChange={onChange} defaultPageIndex={0} pageSize={5} totalCount={300} />,
    )
    expect(getPageRange()).toEqual('1 through 5 of 300')
    expect(getFirstPage()).toEqual(getCurrentPage())
    expect(getInvalidPages()).toHaveLength(0)
    expect(onChange).toHaveBeenCalledWith({
      pageIndex: 0,
    })
    // Unmount before restoring to prevent late async callbacks
    unmount()
    spy.mockRestore()
  })

  it('when rendering 3 pages and the second page is selected we should render a page number not ...', async () => {
    const onChange = vi.fn()
    render(<Pagination aria-label="Test label" onChange={onChange} defaultPageIndex={1} pageSize={2} totalCount={6} />)
    expect(getPageRange()).toEqual('3 through 4 of 6')
    expect(getCurrentPage()).toEqual(getPage(1))
    expect(getInvalidPages()).toHaveLength(0)
  })

  it('should display correct page range when navigating to page 4 with 100 items and page size of 15', async () => {
    // When we have 100 items spread across pages of 15 items, and we go to page 4, we should get the proper page range
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Pagination aria-label="Test label" onChange={onChange} pageSize={15} totalCount={100} />)

    // With 100 items and page size 15, we should have 7 pages total (pages 1-6 have 15 items each, page 7 has 10 items)
    const pages = getPages()
    expect(pages).toHaveLength(7)

    // Navigate to page 4 (index 3)
    await user.click(getPage(3))

    expect(onChange).toHaveBeenCalledWith({
      pageIndex: 3,
    })

    // Page 4 should show items 46-60
    expect(getPageRange()).toEqual('46 through 60 of 100')
    expect(getCurrentPage()).toEqual(getPage(3))

    // Verify all pages are displayed (no truncation needed with only 7 pages)
    const pageNumbers = getPages().map(p => p.textContent.replace(/\D/g, ''))
    expect(pageNumbers).toEqual(['1', '2', '3', '4', '5', '6', '7'])
  })
})

function getPages() {
  return screen.getAllByRole('button').filter(button => {
    return button.textContent.includes('Page')
  })
}

function getPage(index: number) {
  const pages = getPages()
  return pages[index]
}

function getCurrentPage() {
  const page = getPages().find(button => {
    return button.hasAttribute('aria-current')
  })
  if (page) {
    return page
  }

  throw new Error('Unable to find a button with `aria-current`')
}

function getPreviousPage() {
  return screen.getByRole('button', {
    name: 'Previous page',
  })
}

function getNextPage() {
  return screen.getByRole('button', {
    name: 'Next page',
  })
}

function getFirstPage() {
  const pages = getPages()
  return pages[0]
}

function getLastPage() {
  const pages = getPages()
  return pages[pages.length - 1]
}

function getInvalidPages() {
  return getPages().filter(p => p.textContent.match(/Page\s-/g) || p.textContent.match(/Page\s0$/g))
}

function getPageRange() {
  const element = document.querySelector('.TablePaginationRange')
  if (element && element.textContent) {
    return element.textContent.replace('‒', '').replaceAll(' ', ' ')
  }
  throw new Error('Unable to find the text for the page range component')
}

function getPreviousStep(element: HTMLElement) {
  const step = element.closest('li')
  if (step) {
    return step.previousElementSibling
  }
  throw new Error(`Unable to find previous step`)
}

function getNextStep(element: HTMLElement) {
  const step = element.closest('li')
  if (step) {
    return step.nextElementSibling
  }
  throw new Error(`Unable to find next step`)
}
