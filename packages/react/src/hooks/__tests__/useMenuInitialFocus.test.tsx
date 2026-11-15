import {render, fireEvent} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import {describe, it, expect} from 'vitest'
import React from 'react'
import {useMenuInitialFocus} from '../useMenuInitialFocus'

const Component = () => {
  const [open, setOpen] = React.useState(false)
  const onOpen = () => setOpen(!open)

  const containerRef = React.useRef<HTMLDivElement>(null)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  useMenuInitialFocus(open, containerRef, anchorRef)

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => onOpen()}
        onKeyDown={event => {
          // Avoid a second toggle from the native Enter click.
          event.preventDefault()
          onOpen()
        }}
      >
        open container
      </button>
      {open && (
        <div ref={containerRef}>
          <span>not focusable</span>
          <button type="button">first focusable element</button>
          <button type="button">second focusable element</button>
          <button type="button">third focusable element</button>
          <span>not focusable</span>
        </div>
      )}
    </>
  )
}

describe('useMenuInitialFocus', () => {
  it('should focus first element when opened with Enter', async () => {
    render(<Component />)
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')

    await expect.element(page.getByRole('button', {name: 'first focusable element'})).toHaveFocus()
  })

  it('should focus first element when opened with ArrowDown', async () => {
    render(<Component />)
    await userEvent.tab()
    await userEvent.keyboard('{ArrowDown}')

    await expect.element(page.getByRole('button', {name: 'first focusable element'})).toHaveFocus()
  })

  it('should focus last element when opened with ArrowUp', async () => {
    render(<Component />)
    await userEvent.tab()
    await userEvent.keyboard('{ArrowUp}')

    await expect.element(page.getByRole('button', {name: 'third focusable element'})).toHaveFocus()
  })

  it('should focus neither when a different letter is pressed', async () => {
    render(<Component />)
    const button = page.getByRole('button', {name: 'open container'})

    // Dispatch without focusing the trigger to preserve the unmatched-key case.
    fireEvent.keyDown(button.element(), {key: 'ArrowRight', code: 'ArrowRight', keyCode: 39, charCode: 39})

    expect(page.getByRole('button', {name: 'first focusable element'}).element()).not.toEqual(document.activeElement)
    expect(page.getByRole('button', {name: 'third focusable element'}).element()).not.toEqual(document.activeElement)
    expect(document.body).toEqual(document.activeElement)
  })

  it('should keep focus on trigger when opened with click', async () => {
    render(<Component />)

    const button = page.getByRole('button', {name: 'open container'})
    await userEvent.tab()
    await expect.element(button).toHaveFocus()
    await button.click()

    await expect.element(button).toHaveFocus()
  })
})
