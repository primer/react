import {render, fireEvent, waitFor} from '@testing-library/react'
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
      <button ref={anchorRef} type="button" onClick={() => onOpen()} onKeyDown={() => onOpen()}>
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
    const {getByText} = render(<Component />)
    const button = getByText('open container')

    fireEvent.keyDown(button, {key: 'Enter', code: 'Enter', keyCode: 13, charCode: 13})

    /** We use waitFor because the hook uses an effect with setTimeout
     *  and we need to wait for that to happen in the next tick
     */
    await waitFor(() => {
      const firstButton = getByText('first focusable element')
      expect(firstButton).toEqual(document.activeElement)
    })
  })

  it('should focus first element when opened with ArrowDown', async () => {
    const {getByText} = render(<Component />)
    const button = getByText('open container')

    fireEvent.keyDown(button, {key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, charCode: 40})

    await waitFor(() => {
      const firstButton = getByText('first focusable element')
      expect(firstButton).toEqual(document.activeElement)
    })
  })

  it('should focus last element when opened with ArrowUp', async () => {
    const {getByText} = render(<Component />)
    const button = getByText('open container')

    fireEvent.keyDown(button, {key: 'ArrowUp', code: 'ArrowUp', keyCode: 38, charCode: 38})

    await waitFor(() => {
      const thirdButton = getByText('third focusable element')
      expect(thirdButton).toEqual(document.activeElement)
    })
  })

  it('should focus neither when a different letter is pressed', async () => {
    const {getByText} = render(<Component />)
    const button = getByText('open container')

    fireEvent.keyDown(button, {key: 'ArrowRight', code: 'ArrowRight', keyCode: 39, charCode: 39})

    await waitFor(() => {
      const firstButton = getByText('first focusable element')
      const thirdButton = getByText('third focusable element')
      expect(firstButton).not.toEqual(document.activeElement)
      expect(thirdButton).not.toEqual(document.activeElement)
      expect(document.body).toEqual(document.activeElement)
    })
  })

  it('should keep focus on trigger when opened with click', async () => {
    const {getByText} = render(<Component />)

    const button = getByText('open container')
    button.focus() // browsers do this automatically on click, but tests don't
    expect(button).toEqual(document.activeElement)
    fireEvent.click(button)

    await waitFor(() => {
      expect(button).toEqual(document.activeElement)
    })
  })
})
