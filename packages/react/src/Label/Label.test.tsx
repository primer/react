import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import Label from '../Label'

describe('Label', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <Label className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders text node child', () => {
    const container = render(<Label>Default</Label>)
    const label = container.baseElement
    expect(label.textContent?.trim()).toEqual('Default')
  })

  it('default size is rendered as "small"', () => {
    const {getByText} = render(<Label>Default</Label>)

    // Expect the label to have the default size
    expect(getByText('Default')).toHaveAttribute('data-size', 'small')
  })

  it('default variant is rendered as "default"', () => {
    const {getByText} = render(<Label>Default</Label>)

    expect(getByText('Default')).toHaveAttribute('data-variant', 'default')
  })
})
