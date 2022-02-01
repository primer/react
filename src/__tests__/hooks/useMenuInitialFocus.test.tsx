import React from 'react'
import {render, fireEvent, cleanup, waitFor} from '@testing-library/react'
import {useMenuInitialFocus} from '../../hooks'

const Component = () => {
  const [open, setOpen] = React.useState(false)
  const onOpen = () => setOpen(!open)
  const {containerRef, openWithFocus} = useMenuInitialFocus(open, onOpen)

  return (
    <>
      <button onClick={() => setOpen(true)} onKeyDown={event => openWithFocus('anchor-key-press', event)}>
        open container
      </button>
      {open && (
        <div ref={containerRef}>
          <span>not focusable</span>
          <button>first focusable element</button>
          <button>second focusable element</button>
          <button>third focusable element</button>
          <span>not focusable</span>
        </div>
      )}
    </>
  )
}

describe('useMenuFocus', () => {
  afterEach(cleanup)

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
})
