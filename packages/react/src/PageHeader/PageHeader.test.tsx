import {describe, expect, it, vi} from 'vitest'
import {render} from '@testing-library/react'
import {PageHeader} from '.'
import {implementsClassName} from '../utils/testing'
import classes from './PageHeader.module.css'

describe('PageHeader', () => {
  implementsClassName(PageHeader, classes.PageHeader)
  implementsClassName(PageHeader.ContextArea, classes.ContextArea)
  implementsClassName(PageHeader.ParentLink, classes.ParentLink)
  implementsClassName(PageHeader.ContextBar, classes.ContextBar)
  implementsClassName(PageHeader.TitleArea, classes.TitleArea)
  implementsClassName(PageHeader.ContextAreaActions, classes.ContextAreaActions)
  implementsClassName(PageHeader.LeadingAction, classes.LeadingAction)
  implementsClassName(PageHeader.Breadcrumbs, classes.Breadcrumbs)
  implementsClassName(PageHeader.LeadingVisual, classes.LeadingVisual)
  implementsClassName(PageHeader.Title, classes.Title)
  implementsClassName(PageHeader.TrailingVisual, classes.TrailingVisual)
  implementsClassName(PageHeader.TrailingAction, classes.TrailingAction)
  implementsClassName(PageHeader.Actions, classes.Actions)
  implementsClassName(PageHeader.Description, classes.Description)
  implementsClassName(PageHeader.Navigation, classes.Navigation)
  it('respects the title variant prop', () => {
    const {getByText} = render(
      <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea variant="large">
          <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.ContextArea>ContextArea</PageHeader.ContextArea>
      </PageHeader>,
    )
    expect(getByText('Title')).toHaveStyle('font-size: 32px')
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
    const consoleSpy = vi.spyOn(globalThis.console, 'warn').mockImplementation(() => {})
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
