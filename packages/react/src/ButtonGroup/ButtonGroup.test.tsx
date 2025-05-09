import {Button} from '../Button'
import {render, screen} from '@testing-library/react'
import type {ButtonGroupProps} from './ButtonGroup'
import ButtonGroup from './ButtonGroup'
import React from 'react'
import {describe, expect, it} from 'vitest'

const TestButtonGroup = (props: ButtonGroupProps) => (
  <ButtonGroup {...props}>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
    <Button>Button 3</Button>
  </ButtonGroup>
)

describe('ButtonGroup', () => {
  it('should support `className` on the outermost element', () => {
    const {container} = render(<ButtonGroup className="test-class-name" />)
    expect(container.firstChild).toHaveClass('test-class-name')
  })

  it('renders a <div>', () => {
    const {getByTestId} = render(<ButtonGroup data-testid="button-group" />)
    expect(getByTestId('button-group').tagName).toBe('DIV')
  })

  it('should respect role prop', () => {
    render(<ButtonGroup role="toolbar" />)
    expect(screen.getByRole('toolbar')).toBeInTheDocument()
  })
})
