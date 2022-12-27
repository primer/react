import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'
import {PageHeader} from '.'
import MatchMediaMock from 'jest-matchmedia-mock'
import {behavesAsComponent, checkExports, checkStoriesForAxeViolations} from '../utils/testing'
import {act} from 'react-test-renderer'
import {viewportRanges} from '../hooks/useResponsiveValue'
import {IconButton} from '../Button'
import {ChevronLeftIcon, GitBranchIcon, PencilIcon, SidebarExpandIcon} from '@primer/octicons-react'

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
  it('does not render ContextArea in wide viewport as default', () => {
    act(() => {
      matchmedia.useMediaQuery(viewportRanges.wide)
    })

    const {getByText} = render(
      <PageHeader>
        <PageHeader.ContextArea>ContextArea</PageHeader.ContextArea>
        <PageHeader.TitleArea>TitleArea</PageHeader.TitleArea>
        <PageHeader.Description>Description</PageHeader.Description>
        <PageHeader.Navigation>Navigation</PageHeader.Navigation>
      </PageHeader>,
    )
    expect(getByText('ContextArea')).not.toBeVisible()
  })
  it('respects the hidden prop of ContextArea and renders accordingly', () => {
    act(() => {
      matchmedia.useMediaQuery(viewportRanges.regular)
    })

    const {getByText} = render(
      <PageHeader>
        <PageHeader.ContextArea
          hidden={{
            narrow: false,
            regular: false,
            wide: true,
          }}
        >
          ContextArea
        </PageHeader.ContextArea>
        <PageHeader.TitleArea>TitleArea</PageHeader.TitleArea>
        <PageHeader.Description>Description</PageHeader.Description>
        <PageHeader.Navigation>Navigation</PageHeader.Navigation>
      </PageHeader>,
    )
    expect(getByText('ContextArea')).toBeVisible()
  })
  it('respects default visibility of LeadingAction and TrailingAction and renders accordingly', () => {
    act(() => {
      matchmedia.useMediaQuery(viewportRanges.narrow)
    })
    const {getByTestId} = render(
      <PageHeader>
        <PageHeader.ContextArea>ContextArea</PageHeader.ContextArea>
        <PageHeader.TitleArea>
          <PageHeader.LeadingAction>
            <IconButton aria-label="Expand" data-testid="LeadingAction" icon={SidebarExpandIcon} variant="invisible" />
          </PageHeader.LeadingAction>
          <PageHeader.Title>Title</PageHeader.Title>
          <PageHeader.TrailingAction>
            <IconButton aria-label="edit" data-testid="TrailingAction" icon={PencilIcon} variant="invisible" />
          </PageHeader.TrailingAction>
        </PageHeader.TitleArea>
        <PageHeader.Description></PageHeader.Description>
        <PageHeader.Navigation></PageHeader.Navigation>
      </PageHeader>,
    )
    expect(getByTestId('LeadingAction')).not.toBeVisible()
    expect(getByTestId('TrailingAction')).not.toBeVisible()
  })
  it('respects the title variant prop', () => {
    act(() => {
      matchmedia.useMediaQuery(viewportRanges.narrow)
    })
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
    act(() => {
      matchmedia.useMediaQuery(viewportRanges.narrow)
    })
    const {getByText} = render(
      <PageHeader>
        <PageHeader.ContextArea>ContextArea</PageHeader.ContextArea>
        <PageHeader.TitleArea variant="large">
          <PageHeader.LeadingAction>
            Leading Action
            <IconButton aria-label="expand" icon={SidebarExpandIcon} variant="invisible" />
          </PageHeader.LeadingAction>
          <PageHeader.LeadingVisual>
            Leading Visual
            <GitBranchIcon />
          </PageHeader.LeadingVisual>
          <PageHeader.Title>Title</PageHeader.Title>
          <PageHeader.TrailingAction>
            Trailing Action
            <IconButton aria-label="edit" icon={PencilIcon} variant="invisible" />
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
})

checkStoriesForAxeViolations('examples', '../PageHeader/')
