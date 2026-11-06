import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import {describe, expect, it} from 'vitest'
import Pagehead from '../Pagehead'
import {implementsClassName} from '../utils/testing'
import classes from './Pagehead.module.css'

describe('Pagehead', () => {
  implementsClassName(Pagehead, classes.Pagehead)

  it('should support attributes on the outermost element', () => {
    render(
      <Pagehead data-testid="pagehead" className="test-class-name">
        Pagehead
      </Pagehead>,
    )
    const pagehead = page.getByTestId('pagehead').element()
    expect(pagehead).toHaveAttribute('data-testid', 'pagehead')
    expect(pagehead).toHaveAttribute('data-component', 'Pagehead')
  })
})
