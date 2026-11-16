import {describe, expect, it, vi} from 'vitest'
import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import type React from 'react'
import {Stack, StackItem} from '../Stack'
import {implementsClassName} from '../../utils/testing'
import classes from '../Stack.module.css'

describe('StackItem', () => {
  implementsClassName(StackItem, classes.StackItem)

  it('renders data-component attribute', async () => {
    render(
      <Stack>
        <StackItem data-testid="stack-item">Content</StackItem>
      </Stack>,
    )
    await expect.element(page.getByTestId('stack-item')).toHaveAttribute('data-component', 'StackItem')
  })

  it('should render its children', async () => {
    render(
      <Stack>
        <StackItem data-testid="stack-item">Content</StackItem>
      </Stack>,
    )
    await expect.element(page.getByTestId('stack-item')).toHaveTextContent('Content')
  })

  it('should support the `grow` prop', async () => {
    render(
      <Stack>
        <StackItem data-testid="grow-true" grow={true} />
        <StackItem data-testid="grow-false" />
      </Stack>,
    )
    await expect.element(page.getByTestId('grow-true')).toHaveAttribute('data-grow', 'true')
    await expect.element(page.getByTestId('grow-false')).not.toHaveAttribute('data-grow', 'false')
  })

  it('should support responsive `grow` values', async () => {
    render(
      <Stack>
        <StackItem data-testid="responsive-grow" grow={{narrow: true, regular: false, wide: true}} />
      </Stack>,
    )
    await expect.element(page.getByTestId('responsive-grow')).toHaveAttribute('data-grow-narrow', 'true')
    await expect.element(page.getByTestId('responsive-grow')).toHaveAttribute('data-grow-regular', 'false')
    await expect.element(page.getByTestId('responsive-grow')).toHaveAttribute('data-grow-wide', 'true')
  })

  it('should support the `shrink` prop', async () => {
    render(
      <Stack>
        <StackItem data-testid="shrink-true" shrink={true} />
        <StackItem data-testid="shrink-false" />
      </Stack>,
    )
    await expect.element(page.getByTestId('shrink-true')).toHaveAttribute('data-shrink', 'true')
    await expect.element(page.getByTestId('shrink-false')).not.toHaveAttribute('data-shrink', 'false')
  })

  it('should support responsive `shrink` values', async () => {
    render(
      <Stack>
        <StackItem data-testid="responsive-shrink" shrink={{narrow: true, regular: false, wide: true}} />
      </Stack>,
    )
    await expect.element(page.getByTestId('responsive-shrink')).toHaveAttribute('data-shrink-narrow', 'true')
    await expect.element(page.getByTestId('responsive-shrink')).toHaveAttribute('data-shrink-regular', 'false')
    await expect.element(page.getByTestId('responsive-shrink')).toHaveAttribute('data-shrink-wide', 'true')
  })

  it('should render a custom component with the `as` prop', async () => {
    const CustomComponent = vi.fn(({children}: React.PropsWithChildren) => {
      return <div data-testid="custom-stack-item">{children}</div>
    })
    render(
      <Stack>
        <StackItem as={CustomComponent}>Content</StackItem>
      </Stack>,
    )
    expect(CustomComponent).toHaveBeenCalled()
    await expect.element(page.getByTestId('custom-stack-item')).toHaveTextContent('Content')
  })
})
