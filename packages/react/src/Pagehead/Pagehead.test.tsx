import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import Pagehead from '../Pagehead'

describe('Pagehead', () => {
  it('should support `className` on the outermost element', () => {
    const {container} = render(<Pagehead className="test-class-name">Pagehead</Pagehead>)
    expect(container.firstChild).toHaveClass('test-class-name')
  })

  it('should support the `sx` prop', () => {
    const {container} = render(
      <Pagehead sx={{color: 'red'}} className="test-class-name">
        Pagehead
      </Pagehead>,
    )
    expect(container.firstChild).toHaveStyle({color: 'rgb(255, 0, 0)'})
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
