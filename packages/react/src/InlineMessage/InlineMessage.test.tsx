import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import {describe, expect, it, test} from 'vitest'
import {InfoIcon} from '@primer/octicons-react'
import {InlineMessage} from '../InlineMessage'
import React from 'react'
import {implementsClassName} from '../utils/testing'
import classes from './InlineMessage.module.css'

describe('InlineMessage', () => {
  implementsClassName(InlineMessage, classes.InlineMessage)

  it('renders data-component="InlineMessage" on the root element', async () => {
    render(
      <InlineMessage data-testid="container" variant="success">
        test
      </InlineMessage>,
    )
    await expect.element(page.getByTestId('container')).toHaveAttribute('data-component', 'InlineMessage')
  })

  it('should render content passed as `children`', async () => {
    render(<InlineMessage variant="success">test contents</InlineMessage>)
    await expect.element(page.getByText('test contents', {exact: true})).toBeInTheDocument()
  })

  test('forward props to the outermost element', async () => {
    const {container} = render(
      <InlineMessage data-testid="test" variant="success">
        test
      </InlineMessage>,
    )
    await expect.element(container.firstChild as HTMLElement).toHaveAttribute('data-testid', 'test')
  })

  it('should support `size="small"`', async () => {
    render(
      <InlineMessage data-testid="container" size="small" variant="success">
        test
      </InlineMessage>,
    )
    await expect.element(page.getByTestId('container')).toHaveAttribute('data-size', 'small')
  })

  it('should support `size="medium"`', async () => {
    render(
      <InlineMessage data-testid="container" size="medium" variant="success">
        test
      </InlineMessage>,
    )
    await expect.element(page.getByTestId('container')).toHaveAttribute('data-size', 'medium')
  })

  it('should use `size="medium"` as the default size', async () => {
    render(
      <InlineMessage data-testid="container" variant="success">
        test
      </InlineMessage>,
    )
    await expect.element(page.getByTestId('container')).toHaveAttribute('data-size', 'medium')
  })

  it('should support `variant="critical"`', async () => {
    render(
      <InlineMessage data-testid="container" variant="critical">
        test
      </InlineMessage>,
    )
    await expect.element(page.getByTestId('container')).toHaveAttribute('data-variant', 'critical')
  })

  it('should support `variant="success"`', async () => {
    render(
      <InlineMessage data-testid="container" variant="success">
        test
      </InlineMessage>,
    )
    await expect.element(page.getByTestId('container')).toHaveAttribute('data-variant', 'success')
  })

  it('should support `variant="unavailable"`', async () => {
    render(
      <InlineMessage data-testid="container" variant="unavailable">
        test
      </InlineMessage>,
    )
    await expect.element(page.getByTestId('container')).toHaveAttribute('data-variant', 'unavailable')
  })

  it('should support `variant="warning"`', async () => {
    render(
      <InlineMessage data-testid="container" variant="warning">
        test
      </InlineMessage>,
    )
    await expect.element(page.getByTestId('container')).toHaveAttribute('data-variant', 'warning')
  })

  it('should not set data-variant when variant is not provided', async () => {
    render(<InlineMessage data-testid="container">test</InlineMessage>)
    await expect.element(page.getByTestId('container')).not.toHaveAttribute('data-variant')
  })

  it('should render InfoIcon when variant is not provided', async () => {
    const {container} = render(<InlineMessage>test without variant</InlineMessage>)
    await expect.element(page.getByText('test without variant', {exact: true})).toBeInTheDocument()
    const svg = container.querySelector<SVGElement>('svg.octicon-info')
    await expect.element(svg).toBeInTheDocument()
  })

  it('should render leading visual', async () => {
    render(
      <>
        <InlineMessage variant="critical" leadingVisual={<InfoIcon data-testid="info-icon" />}>
          test with custom icon
        </InlineMessage>
        <InlineMessage
          variant="critical"
          leadingVisual={React.memo(() => (
            <div data-testid="memo">leadingVisual</div>
          ))}
        >
          test with memo icon
        </InlineMessage>
        <InlineMessage
          variant="critical"
          leadingVisual={React.forwardRef(() => (
            <div data-testid="forward-ref">leadingVisual</div>
          ))}
        >
          test with forward ref icon
        </InlineMessage>
      </>,
    )
    await expect.element(page.getByTestId('info-icon')).toBeInTheDocument()
    await expect.element(page.getByTestId('memo')).toBeInTheDocument()
    await expect.element(page.getByTestId('forward-ref')).toBeInTheDocument()
  })

  it('should use default icon when `leadingVisual` is not provided', async () => {
    const {container} = render(<InlineMessage variant="success">test with default icon</InlineMessage>)
    await expect.element(page.getByText('test with default icon', {exact: true})).toBeInTheDocument()
    // Default icon should be rendered
    const svg = container.querySelector('svg')
    await expect.element(svg).toBeInTheDocument()
  })
})
