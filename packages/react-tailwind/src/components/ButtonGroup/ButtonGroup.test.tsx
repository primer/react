import React from 'react'
import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it} from 'vitest'
import {Button} from '../Button'
import {ButtonGroup} from './ButtonGroup'

afterEach(cleanup)

describe('ButtonGroup', () => {
  it('forwards props and ref to its group root', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <ButtonGroup ref={ref} data-testid="group">
        Actions
      </ButtonGroup>,
    )
    expect(screen.getByTestId('group')).toHaveAttribute('role', 'group')
    expect(screen.getByTestId('group')).toBe(ref.current)
  })

  it('moves focus between toolbar buttons with the arrow keys, Home, and End', async () => {
    const user = userEvent.setup()
    render(
      <ButtonGroup role="toolbar" aria-label="Formatting">
        <Button>Bold</Button>
        <Button>Italic</Button>
        <Button>Underline</Button>
      </ButtonGroup>,
    )
    const [bold, italic, underline] = screen.getAllByRole('button')
    expect(screen.getByRole('toolbar')).not.toHaveAttribute('aria-orientation')
    expect([bold, italic, underline].map(button => button.getAttribute('tabindex'))).toEqual(['0', '-1', '-1'])

    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(italic).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(italic).toHaveFocus()
    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(underline).toHaveFocus()
    await user.keyboard('{Home}')
    expect(bold).toHaveFocus()
    await user.keyboard('{End}')
    expect(underline).toHaveFocus()
  })

  it('uses the vertical arrows in a vertical toolbar', async () => {
    const user = userEvent.setup()
    render(
      <ButtonGroup role="toolbar" aria-label="Zoom" orientation="vertical">
        <Button>Zoom in</Button>
        <Button>Zoom out</Button>
      </ButtonGroup>,
    )
    expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'vertical')
    await user.tab()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', {name: 'Zoom out'})).toHaveFocus()
  })

  it('leaves the buttons of a plain group in the tab order', () => {
    render(
      <ButtonGroup orientation="vertical">
        <Button>Edit</Button>
        <Button>Delete</Button>
      </ButtonGroup>,
    )
    expect(screen.getByRole('group')).not.toHaveAttribute('aria-orientation')
    for (const button of screen.getAllByRole('button')) expect(button).not.toHaveAttribute('tabindex', '-1')
  })
})
