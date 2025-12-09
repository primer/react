import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import Pagehead from '../Pagehead'
import {implementsClassName} from '../utils/testing'
import classes from './Pagehead.module.css'

describe('Pagehead', () => {
  implementsClassName(Pagehead, classes.Pagehead)

  it('should support `className` on the outermost element', () => {
    const {container} = render(<Pagehead className="test-class-name">Pagehead</Pagehead>)
    expect(container.firstChild).toHaveClass('test-class-name')
  })

  it('should support attributes on the outermost element', () => {
    const {container} = render(
      <Pagehead data-testid="pagehead" className="test-class-name">
        Pagehead
      </Pagehead>,
    )
    expect(container.firstChild).toHaveAttribute('data-testid', 'pagehead')
  })
})
