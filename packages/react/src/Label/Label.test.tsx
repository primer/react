import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import Label from '../Label'
import {implementsClassName} from '../utils/testing'
import classes from './Label.module.css'

describe('Label', () => {
  implementsClassName(Label, classes.Label)

  it('should support `className` on the outermost element', () => {
    const Element = () => <Label className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })
  it('renders text node child', () => {
    const rendered = render(<Label>Default</Label>)
    expect(rendered.container.textContent).toEqual('Default')
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
