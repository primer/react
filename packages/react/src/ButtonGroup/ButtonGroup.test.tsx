import {render, screen} from '@testing-library/react'
import ButtonGroup from './ButtonGroup'
import {describe, expect, it} from 'vitest'
import {implementsClassName} from '../utils/testing'
import classes from './ButtonGroup.module.css'

describe('ButtonGroup', () => {
  implementsClassName(ButtonGroup, classes.ButtonGroup)

  it('renders a <div>', () => {
    const container = render(<ButtonGroup data-testid="button-group" />)
    expect(container.getByTestId('button-group').tagName).toBe('DIV')
  })

  it('should respect role prop', () => {
    render(<ButtonGroup role="toolbar" />)
    expect(screen.getByRole('toolbar')).toBeInTheDocument()
  })
})
