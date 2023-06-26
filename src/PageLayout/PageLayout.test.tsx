import React from 'react'
import {act, fireEvent, render, screen} from '@testing-library/react'
import MatchMediaMock from 'jest-matchmedia-mock'
import 'react-intersection-observer/test-utils'
import {ThemeProvider} from '..'
import {viewportRanges} from '../hooks/useResponsiveValue'
import {PageLayout} from './PageLayout'
import {Placeholder} from '../Placeholder'

let matchMedia: MatchMediaMock

describe('PageLayout', () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock()
  })

  afterEach(() => {
    matchMedia.clear()
  })

  it('renders default layout', () => {
    const {container} = render(
      <ThemeProvider>
        <PageLayout>
          <PageLayout.Header>Header</PageLayout.Header>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Pane>Pane</PageLayout.Pane>
          <PageLayout.Footer>Footer</PageLayout.Footer>
        </PageLayout>
      </ThemeProvider>,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders condensed layout', () => {
    const {container} = render(
      <ThemeProvider>
        <PageLayout padding="condensed" rowGap="condensed" columnGap="condensed">
          <PageLayout.Header>Header</PageLayout.Header>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Pane>Pane</PageLayout.Pane>
          <PageLayout.Footer>Footer</PageLayout.Footer>
        </PageLayout>
      </ThemeProvider>,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with dividers', () => {
    const {container} = render(
      <ThemeProvider>
        <PageLayout>
          <PageLayout.Header divider="line" dividerWhenNarrow="filled">
            Header
          </PageLayout.Header>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Pane position="start" divider="line" dividerWhenNarrow="filled">
            Pane
          </PageLayout.Pane>
          <PageLayout.Footer dividerWhenNarrow="line">Footer</PageLayout.Footer>
        </PageLayout>
      </ThemeProvider>,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders pane in different position when narrow', () => {
    const {container} = render(
      <ThemeProvider>
        <PageLayout>
          <PageLayout.Header>Header</PageLayout.Header>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Pane positionWhenNarrow="start">Pane</PageLayout.Pane>
          <PageLayout.Footer>Footer</PageLayout.Footer>
        </PageLayout>
      </ThemeProvider>,
    )
    expect(container).toMatchSnapshot()
  })

  it('can hide pane when narrow', () => {
    // Set narrow viewport
    act(() => {
      matchMedia.useMediaQuery(viewportRanges.narrow)
    })

    const {getByText} = render(
      <ThemeProvider>
        <PageLayout>
          <PageLayout.Header>Header</PageLayout.Header>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Pane hidden={{narrow: true}}>Pane</PageLayout.Pane>
          <PageLayout.Footer>Footer</PageLayout.Footer>
        </PageLayout>
      </ThemeProvider>,
    )

    expect(getByText('Pane')).not.toBeVisible()
  })

  it('shows all subcomponents by default', () => {
    // Set regular viewport
    act(() => {
      matchMedia.useMediaQuery(viewportRanges.regular)
    })

    const {getByText} = render(
      <ThemeProvider>
        <PageLayout>
          <PageLayout.Header>Header</PageLayout.Header>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Pane hidden={{narrow: true}}>Pane</PageLayout.Pane>
          <PageLayout.Footer>Footer</PageLayout.Footer>
        </PageLayout>
      </ThemeProvider>,
    )

    expect(getByText('Pane')).toBeVisible()
  })

  it('should support labeling landmarks through `aria-label`', () => {
    render(
      <ThemeProvider>
        <PageLayout>
          <PageLayout.Header aria-label="Header">Header</PageLayout.Header>
          <PageLayout.Content aria-label="Content">Content</PageLayout.Content>
          <PageLayout.Pane>Pane</PageLayout.Pane>
          <PageLayout.Footer aria-label="Footer">Footer</PageLayout.Footer>
        </PageLayout>
      </ThemeProvider>,
    )

    expect(screen.getByRole('banner')).toHaveAccessibleName('Header')
    expect(screen.getByRole('main')).toHaveAccessibleName('Content')
    expect(screen.getByRole('contentinfo')).toHaveAccessibleName('Footer')
  })

  it('should support labeling landmarks through `aria-labelledby`', () => {
    render(
      <ThemeProvider>
        <PageLayout>
          <PageLayout.Header aria-labelledby="header-label">
            <span id="header-label">header</span>
          </PageLayout.Header>
          <PageLayout.Content aria-labelledby="content-label">
            <span id="content-label">content</span>
          </PageLayout.Content>
          <PageLayout.Pane>Pane</PageLayout.Pane>
          <PageLayout.Footer aria-labelledby="footer-label">
            <span id="footer-label">footer</span>
          </PageLayout.Footer>
        </PageLayout>
      </ThemeProvider>,
    )

    expect(screen.getByRole('banner')).toHaveAccessibleName('header')
    expect(screen.getByRole('main')).toHaveAccessibleName('content')
    expect(screen.getByRole('contentinfo')).toHaveAccessibleName('footer')
  })

  describe('PageLayout.Pane', () => {
    it('should support a ref on the element wrapping the contents of Pane', () => {
      const ref = jest.fn()
      render(
        <ThemeProvider>
          <PageLayout>
            <PageLayout.Pane ref={ref}>
              <div data-testid="content">Pane</div>
            </PageLayout.Pane>
          </PageLayout>
        </ThemeProvider>,
      )
      expect(ref).toHaveBeenCalledWith(screen.getByTestId('content').parentNode)
    })

    it('should be resizable if `resizable` is set correctly', async () => {
      render(
        <ThemeProvider>
          <PageLayout>
            <PageLayout.Pane resizable>
              <Placeholder height={320} label="Pane" />
            </PageLayout.Pane>
            <PageLayout.Content>
              <Placeholder height={640} label="Content" />
            </PageLayout.Content>
          </PageLayout>
        </ThemeProvider>,
      )

      const placeholder = await screen.findByText('Pane')
      const pane = placeholder.parentNode
      const initialWidth = (pane as HTMLElement).style.getPropertyValue('--pane-width')

      const divider = await screen.findByRole('separator')
      // Moving divider should resize pane.
      fireEvent.mouseDown(divider)
      fireEvent.mouseMove(divider)
      fireEvent.mouseUp(divider)
      const finalWidth = (pane as HTMLElement).style.getPropertyValue('--pane-width')
      expect(finalWidth).not.toEqual(initialWidth)
    })
  })
})
