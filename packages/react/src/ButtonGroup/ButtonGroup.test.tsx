import {render, screen} from '@testing-library/react'
import ButtonGroup from './ButtonGroup'
import {describe, expect, it} from 'vitest'

describe('ButtonGroup', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <ButtonGroup className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders a <div>', () => {
    const container = render(<ButtonGroup data-testid="button-group" />)
    expect(container.getByTestId('button-group').tagName).toBe('DIV')
  })

  it('should respect role prop', () => {
    render(<ButtonGroup role="toolbar" />)
    expect(screen.getByRole('toolbar')).toBeInTheDocument()
  })
})
