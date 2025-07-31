import {render} from '@testing-library/react'
import {PageHeader} from '.'
import MatchMediaMock from 'jest-matchmedia-mock'
import {behavesAsComponent, checkExports} from '../utils/testing'

let matchmedia: MatchMediaMock
describe('PageHeader', () => {
  beforeAll(() => {
    matchmedia = new MatchMediaMock()
    const observe = jest.fn()
    window.IntersectionObserver = jest.fn(() => ({
      observe,
      unobserve: jest.fn(),
      takeRecords: jest.fn(),
      disconnect: jest.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
    })) as jest.Mock<IntersectionObserver>
  })
  afterAll(() => {
    matchmedia.clear()
  })
  behavesAsComponent({
    Component: PageHeader,
    options: {skipAs: true, skipSx: true},
    toRender: () => (
      <PageHeader role="banner" aria-label="Banner">
        <PageHeader.TitleArea></PageHeader.TitleArea>
        <PageHeader.ContextArea></PageHeader.ContextArea>
        <PageHeader.Description></PageHeader.Description>
        <PageHeader.Navigation></PageHeader.Navigation>
      </PageHeader>
    ),
  })
  checkExports('PageHeader', {
    default: undefined,
    PageHeader,
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
  it('logs a warning when the Navigation component is rendered as "nav" but no "aria-label" or "aria-labelledby" prop is provided', () => {
    const consoleSpy = jest.spyOn(global.console, 'warn').mockImplementation()
    render(
      <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea>
          <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Navigation as="nav">Navigation</PageHeader.Navigation>
      </PageHeader>,
    )
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
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
