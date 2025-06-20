import {XIcon} from '@primer/octicons-react'
import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import Octicon from '../Octicon'

describe('Octicon', () => {
  it('should support `className` on the outermost element', () => {
    const {container} = render(<Octicon icon={XIcon} className="test-class" />)
    expect(container.firstChild).toHaveClass('test-class')
  })

  it('should support `sx`', () => {
    const {container} = render(<Octicon icon={XIcon} sx={{color: 'red'}} />)
    expect(container.firstChild).toHaveStyle('color: rgb(255, 0, 0)')
  })

  it('should pass along props to the outermost element', () => {
    const {container} = render(<Octicon icon={XIcon} data-testid="test-id" />)
    expect(container.firstChild).toHaveAttribute('data-testid', 'test-id')
  })
})
