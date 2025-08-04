import {describe, expect, it, vi, beforeAll, afterAll} from 'vitest'
import {render} from '@testing-library/react'
import {PageHeader} from '.'

describe('PageHeader', () => {
  beforeAll(() => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })
  afterAll(() => {
    vi.restoreAllMocks()
  })
  it('respects the title variant prop', () => {
    const {getByText} = render(
      <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea variant="large">
          <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.ContextArea>ContextArea</PageHeader.ContextArea>
      </PageHeader>,
    )
    expect(getByText('Title')).toHaveStyle('font-size: 1.5em')
  })
  it('renders "aria-label" prop when Navigation is rendered as "nav" landmark', () => {
    const {getByLabelText, getByText} = render(
      <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea>
          <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Navigation as="nav" aria-label="Custom">
          Navigation
        </PageHeader.Navigation>
      </PageHeader>,
    )
    expect(getByLabelText('Custom')).toBeInTheDocument()
    expect(getByText('Navigation')).toHaveAttribute('aria-label', 'Custom')
  })
  it('does not render "aria-label" prop when Navigation is rendered as "div"', () => {
    const {getByText} = render(
      <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea>
          <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Navigation aria-label="Custom">Navigation</PageHeader.Navigation>
      </PageHeader>,
    )
    expect(getByText('Navigation')).not.toHaveAttribute('aria-label')
  })
  it('does not render "role" attribute when not explicitly specified', () => {
    const {container} = render(
      <PageHeader>
        <PageHeader.TitleArea>
          <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>,
    )
    expect(container.firstChild).not.toHaveAttribute('role')
  })
  it('renders "role" attribute when explicitly specified', () => {
    const {container} = render(
      <PageHeader role="banner">
        <PageHeader.TitleArea>
          <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>,
    )
    expect(container.firstChild).toHaveAttribute('role', 'banner')
  })
  it('does not render "aria-label" attribute when not explicitly specified', () => {
    const {container} = render(
      <PageHeader role="banner">
        <PageHeader.TitleArea>
          <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>,
    )
    expect(container.firstChild).not.toHaveAttribute('aria-label')
  })
  it('renders custom "aria-label" attribute when explicitly specified', () => {
    const {container} = render(
      <PageHeader aria-label="Custom aria-label" role="banner">
        <PageHeader.TitleArea>
          <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>,
    )
    expect(container.firstChild).toHaveAttribute('aria-label', 'Custom aria-label')
  })
})
