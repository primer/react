import React from 'react'
import {render} from '@testing-library/react'
import {PageHeader} from '.'
import MatchMediaMock from 'jest-matchmedia-mock'
import {behavesAsComponent, checkExports, renderStyles} from '../utils/testing'
import {IconButton} from '../Button'
import {SidebarExpandIcon} from '@primer/octicons-react'
import {mediaQueries} from '../utils/layout'

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
      <PageHeader>
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
  /** These 3 tests below are not following the user behavioural pattern testing paradigm.
   * They are testing the internal implementation of the component and checking if the component
   * is rendering the correct styles.This approach was necessary due to the impracticality of CSS media queries testing with Jest.
   */
  it('respects default visibility of ContextArea and renders CSS media styles correctly', () => {
    const expectedStyles = {
      '-ms-flex-align': 'center',
      '-ms-flex-direction': 'row',
      '-webkit-align-items': 'center',
      '-webkit-box-align': 'center',
      '-webkit-flex-direction': 'row',
      [`@media screen and (max-width:calc(768px - 0.02px))`]: {
        display: 'flex',
      },
      [`${mediaQueries.regular.replace(': ', ':')}`]: {
        display: 'none',
      },
      'align-items': 'center',
      display: 'flex',
      'flex-direction': 'row',
      gap: '0.5rem',
      'grid-area': 'context-area',
      'padding-bottom': '0.5rem',
      'grid-row': '1',
    }

    expect(renderStyles(<PageHeader.ContextArea>ContextArea</PageHeader.ContextArea>)).toEqual(
      expect.objectContaining(expectedStyles),
    )
  })
  it('respects the hidden prop of ContextArea and renders CSS media styles correctly', () => {
    const expectedStyles = {
      '-ms-flex-align': 'center',
      '-ms-flex-direction': 'row',
      '-webkit-align-items': 'center',
      '-webkit-box-align': 'center',
      '-webkit-flex-direction': 'row',
      [`@media screen and (max-width:calc(768px - 0.02px))`]: {
        display: 'flex',
      },
      [`${mediaQueries.regular.replace(': ', ':')}`]: {
        display: 'flex',
      },
      [`${mediaQueries.wide.replace(': ', ':')}`]: {
        display: 'none',
      },
      'align-items': 'center',
      display: 'flex',
      'flex-direction': 'row',
      gap: '0.5rem',
      'grid-area': 'context-area',
      'grid-row': '1',
      'padding-bottom': '0.5rem',
    }

    expect(
      renderStyles(
        <PageHeader.ContextArea
          hidden={{
            narrow: false,
            regular: false,
            wide: true,
          }}
        >
          ContextArea
        </PageHeader.ContextArea>,
      ),
    ).toEqual(expect.objectContaining(expectedStyles))
  })
  it('respects default visibility of LeadingAction and TrailingAction and renders CSS media styles correctly', () => {
    const expectedStyles = {
      '-ms-flex-align': 'center',
      '-webkit-align-items': 'center',
      '-webkit-box-align': 'center',
      [`@media screen and (max-width:calc(768px - 0.02px))`]: {
        display: 'none',
      },
      [`${mediaQueries.regular.replace(': ', ':')}`]: {
        display: 'flex',
      },
      'align-items': 'center',
      display: 'flex',
      'grid-area': 'leading-action',
      'grid-row': '2',
      'padding-right': '0.5rem',
    }

    expect(
      renderStyles(
        <PageHeader.LeadingAction>
          <IconButton aria-label="Expand" data-testid="LeadingAction" icon={SidebarExpandIcon} variant="invisible" />
        </PageHeader.LeadingAction>,
      ),
    ).toEqual(expect.objectContaining(expectedStyles))
  })
  it('respects the title variant prop', () => {
    const {getByText} = render(
      <PageHeader>
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
      <PageHeader>
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
  it('does not renders "aria-label" prop when Navigation is rendered as "div"', () => {
    const {getByText} = render(
      <PageHeader>
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
      <PageHeader>
        <PageHeader.TitleArea>
          <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Navigation as="nav">Navigation</PageHeader.Navigation>
      </PageHeader>,
    )
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
