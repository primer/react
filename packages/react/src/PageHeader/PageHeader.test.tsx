import {describe, expect, it, vi} from 'vitest'
import {render, waitFor} from '@testing-library/react'
import {PageHeader} from '.'
import {useState, useEffect} from 'react'

describe('PageHeader', () => {
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

  it('has default fallback styles when children are lazy loaded', async () => {
    // Component simulating lazy loading scenario
    function LazyLoadedPageHeader() {
      const [showTitle, setShowTitle] = useState(false)

      useEffect(() => {
        // Simulate lazy loading delay
        const timer = setTimeout(() => setShowTitle(true), 10)
        return () => clearTimeout(timer)
      }, [])

      return (
        <PageHeader role="banner" aria-label="Test">
          {showTitle && (
            <PageHeader.TitleArea variant="medium">
              <PageHeader.Title>Title</PageHeader.Title>
            </PageHeader.TitleArea>
          )}
          <PageHeader.Actions>
            <button type="button">Action</button>
          </PageHeader.Actions>
        </PageHeader>
      )
    }

    const {container} = render(<LazyLoadedPageHeader />)
    const pageHeader = container.querySelector('[role="banner"]') as HTMLElement

    // Before children load, PageHeader should have default styles
    expect(pageHeader).toBeInTheDocument()

    // Check that CSS custom property has a fallback value by verifying computed style
    const computedStyle = window.getComputedStyle(pageHeader)
    const titleLineHeight = computedStyle.getPropertyValue('--title-line-height')

    // Should have default value before TitleArea renders
    expect(titleLineHeight).toBeTruthy()
    expect(titleLineHeight.trim()).not.toBe('')

    // Wait for lazy loaded content
    await waitFor(() => {
      expect(container.querySelector('[data-component="TitleArea"]')).toBeInTheDocument()
    })

    // After children load, styles should still work
    const updatedComputedStyle = window.getComputedStyle(pageHeader)
    const updatedTitleLineHeight = updatedComputedStyle.getPropertyValue('--title-line-height')
    expect(updatedTitleLineHeight).toBeTruthy()
  })
})
