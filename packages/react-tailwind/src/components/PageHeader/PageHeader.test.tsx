import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {PageHeader} from './PageHeader'

describe('PageHeader', () => {
  it('preserves consumer heading semantics and forwards root props', () => {
    render(
      <PageHeader data-testid="page-header">
        <PageHeader.TitleArea>
          <PageHeader.Title as="h1">Settings</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>,
    )
    expect(screen.getByRole('heading', {level: 1, name: 'Settings'})).toBeVisible()
    expect(screen.getByTestId('page-header')).toHaveAttribute('data-component', 'PageHeader')
  })

  it('lets hidden override the narrow-only defaults and emits concrete responsive title utilities', () => {
    render(
      <PageHeader>
        <PageHeader.ContextArea hidden={false} data-testid="context">
          Context
        </PageHeader.ContextArea>
        <PageHeader.TitleArea variant={{narrow: 'subtitle', regular: 'large'}} data-testid="title-area">
          <PageHeader.Title>Settings</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>,
    )
    expect(screen.getByTestId('context')).not.toHaveClass('md:hidden')
    expect(screen.getByTestId('title-area')).toHaveClass(
      'text-title-medium',
      'md:text-title-large',
      '2xl:text-title-medium',
    )
  })

  it('preserves title inheritance and flex layout for visible compound parts', () => {
    render(
      <PageHeader>
        <PageHeader.TitleArea>
          <PageHeader.Title data-testid="title">Settings</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Actions data-testid="actions">Actions</PageHeader.Actions>
        <PageHeader.Description data-testid="description">Description</PageHeader.Description>
      </PageHeader>,
    )

    expect(screen.getByTestId('title')).toHaveClass(
      '[font-size:inherit]',
      '[font-weight:inherit]',
      '[line-height:inherit]',
    )
    expect(screen.getByTestId('actions')).toHaveClass('flex')
    expect(screen.getByTestId('description')).toHaveClass('flex')
  })
})
