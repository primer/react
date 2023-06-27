import React from 'react'
import {render} from '@testing-library/react'
import {PageHeader} from '.'
import MatchMediaMock from 'jest-matchmedia-mock'
import {behavesAsComponent, checkExports, renderStyles} from '../utils/testing'
import {IconButton} from '../Button'
import {ChevronLeftIcon, GitBranchIcon, PencilIcon, SidebarExpandIcon} from '@primer/octicons-react'
import {mediaQueries} from '../utils/layout'

let matchmedia: MatchMediaMock
describe('PageHeader', () => {
  beforeAll(() => {
    matchmedia = new MatchMediaMock()
  })
  afterAll(() => {
    matchmedia.clear()
  })
  behavesAsComponent({
    Component: PageHeader,
    options: {skipAs: true, skipSx: true},
    toRender: () => (
      <PageHeader>
        <PageHeader.ContextArea></PageHeader.ContextArea>
        <PageHeader.TitleArea></PageHeader.TitleArea>
        <PageHeader.Description></PageHeader.Description>
        <PageHeader.Navigation></PageHeader.Navigation>
      </PageHeader>
    ),
  })
  checkExports('PageHeader', {
    default: undefined,
    PageHeader,
  })
  it('renders default layout', () => {
    const {container} = render(
      <PageHeader>
        <PageHeader.ContextArea>ContextArea</PageHeader.ContextArea>
        <PageHeader.TitleArea>TitleArea</PageHeader.TitleArea>
        <PageHeader.Description>Description</PageHeader.Description>
        <PageHeader.Navigation>Navigation</PageHeader.Navigation>
      </PageHeader>,
    )
    expect(container).toMatchSnapshot()
  })
  /** These 3 tests below are not following the user behavioural pattern testing paradigm.
   * They are testing the internal implementation of the component and checking if the component
   * is rendering the correct styles.This approach was necessary due to the impracticality of CSS media queries testing with Jest.
   */
  it('respects default visibility of ContextArea and renders CSS media styles correctly', () => {
    const expectedStyles = {
      '-ms-flex-align': 'center',
      '-ms-flex-direction': 'row',
      '-ms-flex-order': '0',
      '-webkit-align-items': 'center',
      '-webkit-box-align': 'center',
      '-webkit-flex-direction': 'row',
      '-webkit-order': '0',
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
      order: '0',
    }

    expect(renderStyles(<PageHeader.ContextArea>ContextArea</PageHeader.ContextArea>)).toEqual(
      expect.objectContaining(expectedStyles),
    )
  })
  it('respects the hidden prop of ContextArea and renders CSS media styles correctly', () => {
    const expectedStyles = {
      '-ms-flex-align': 'center',
      '-ms-flex-direction': 'row',
      '-ms-flex-order': '0',
      '-webkit-align-items': 'center',
      '-webkit-box-align': 'center',
      '-webkit-flex-direction': 'row',
      '-webkit-order': '0',
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
      order: '0',
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
      height: '2rem',
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
        <PageHeader.ContextArea>ContextArea</PageHeader.ContextArea>
        <PageHeader.TitleArea variant="large">
          <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>,
    )
    expect(getByText('Title')).toHaveStyle('font-size: 2rem')
  })
  it("respects the title variant prop and updates the children components' container height accordingly", () => {
    const {getByText} = render(
      <PageHeader>
        <PageHeader.ContextArea>ContextArea</PageHeader.ContextArea>
        <PageHeader.TitleArea variant="large">
          <PageHeader.LeadingAction>
            Leading Action
            <IconButton aria-label="Expand" icon={SidebarExpandIcon} variant="invisible" />
          </PageHeader.LeadingAction>
          <PageHeader.LeadingVisual>
            Leading Visual
            <GitBranchIcon />
          </PageHeader.LeadingVisual>
          <PageHeader.Title>Title</PageHeader.Title>
          <PageHeader.TrailingAction>
            Trailing Action
            <IconButton aria-label="Edit" icon={PencilIcon} variant="invisible" />
          </PageHeader.TrailingAction>
          <PageHeader.TrailingVisual>
            Trailing Visual
            <ChevronLeftIcon />
          </PageHeader.TrailingVisual>
        </PageHeader.TitleArea>
      </PageHeader>,
    )

    expect(getByText('Leading Visual')).toHaveStyle('height: 3rem')
    expect(getByText('Trailing Visual')).toHaveStyle('height: 3rem')
    expect(getByText('Leading Action')).toHaveStyle('height: 3rem')
    expect(getByText('Trailing Action')).toHaveStyle('height: 3rem')
    // add actions here
  })
  it('renders "aria-label" prop when Navigation is rendered as "nav" landmark', () => {
    const {getByLabelText, getByText} = render(
      <PageHeader>
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
        <PageHeader.Navigation aria-label="Custom">Navigation</PageHeader.Navigation>
      </PageHeader>,
    )
    expect(getByText('Navigation')).not.toHaveAttribute('aria-label')
  })
  it('logs a warning when the Navigation component is rendered as "nav" but no "aria-label" or "aria-labelledby" prop is provided', () => {
    const consoleSpy = jest.spyOn(global.console, 'warn').mockImplementation()
    render(
      <PageHeader>
        <PageHeader.Navigation as="nav">Navigation</PageHeader.Navigation>
      </PageHeader>,
    )
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
