import {render} from '@testing-library/react'
import React from 'react'
import {ThemeProvider} from '..'
import {PageLayout} from './PageLayout'

describe('PageLayout', () => {
  it('renders default layout', () => {
    const {container} = render(
      <ThemeProvider>
        <PageLayout>
          <PageLayout.Header>Header</PageLayout.Header>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Pane>Pane</PageLayout.Pane>
          <PageLayout.Footer>Footer</PageLayout.Footer>
        </PageLayout>
      </ThemeProvider>
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
      </ThemeProvider>
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
      </ThemeProvider>
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
      </ThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
