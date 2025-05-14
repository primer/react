import type {SpinnerProps} from '..'
import {Spinner} from '..'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'

describe('Spinner', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <Spinner className={'test-class-name'} />
    expect(render(<Element />).container.firstChild?.firstChild).toHaveClass('test-class-name')
  })

  it('should label the spinner with default loading text', async () => {
    const {getByLabelText} = render(<Spinner />)

    expect(getByLabelText('Loading')).toBeInTheDocument()
  })

  it('should label the spinner with with custom loading text', async () => {
    const {getByLabelText} = render(<Spinner srText="Custom loading text" />)

    expect(getByLabelText('Custom loading text')).toBeInTheDocument()
  })

  it('should not label the spinner with with loading text when `srText` is set to `null`', () => {
    const {getByLabelText} = render(<Spinner srText={null} />)

    expect(() => getByLabelText('Loading')).toThrow()
  })

  it('should use `aria-label` over `srText` if `aria-label` is provided', () => {
    render(<Spinner aria-label="Test label" />)
    expect(screen.getByLabelText('Test label')).toBeInTheDocument()
  })

  it('should respect size arguments', () => {
    const expectSize = (input: SpinnerProps['size'] | undefined, expectedSize: string) => {
      const {container} = render(<Spinner size={input} />)
      const svg = container.querySelector('svg')!
      expect(svg.getAttribute('height')).toEqual(expectedSize)
      expect(svg.getAttribute('width')).toEqual(expectedSize)
    }

    // default: medium
    expectSize(undefined, '32px')
    expectSize('small', '16px')
    expectSize('medium', '32px')
    expectSize('large', '64px')
  })
})
