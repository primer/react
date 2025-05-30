import {render, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {it, expect} from 'vitest'
import {useRef, useState} from 'react'
import {useOpenAndCloseFocus} from '../../hooks/useOpenAndCloseFocus'

const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLButtonElement>(null)
  const noButtonRef = useRef<HTMLButtonElement>(null)
  useOpenAndCloseFocus({containerRef, initialFocusRef: noButtonRef, returnFocusRef})
  return (
    <>
      <button type="button" ref={returnFocusRef}>
        trigger
      </button>
      <div ref={containerRef}>
        <button type="button">yes</button>
        <button ref={noButtonRef} type="button">
          no
        </button>
      </div>
    </>
  )
}

const ComponentTwo = () => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  useOpenAndCloseFocus({containerRef, returnFocusRef: buttonRef})
  return (
    <>
      <button ref={buttonRef} type="button">
        button trigger
      </button>
      <div ref={containerRef}>
        <button type="button">yes</button>
        <button type="button">no</button>
      </div>
    </>
  )
}

const ComponentThree = () => {
  const [isOpen, setIsOpen] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLButtonElement>(null)
  const noButtonRef = useRef<HTMLButtonElement>(null)
  useOpenAndCloseFocus({containerRef, initialFocusRef: noButtonRef, returnFocusRef, preventFocusOnOpen: true})

  return (
    <>
      <button ref={returnFocusRef} type="button" onClick={() => setIsOpen(!isOpen)}>
        toggle
      </button>
      {isOpen && (
        <div ref={containerRef}>
          <button type="button">yes</button>
          <button ref={noButtonRef} type="button">
            no
          </button>
        </div>
      )}
    </>
  )
}

it('should focus initialFocusRef element passed into function', async () => {
  const {getByText} = render(<Component />)
  await waitFor(() => getByText('no'))
  const noButton = getByText('no')
  expect(document.activeElement).toEqual(noButton)
})

it('should focus first element when no initialFocusRef prop is passed', async () => {
  const {getByText} = render(<ComponentTwo />)
  await waitFor(() => getByText('yes'))
  const yesButton = getByText('yes')
  expect(document.activeElement).toEqual(yesButton)
})

it('should not focus any element if preventFocusOnOpen prop is passed', async () => {
  render(<ComponentThree />)
  expect(document.activeElement).toEqual(document.body)
})

it('should focus returnFocusRef element when rendered', async () => {
  const user = userEvent.setup()
  const {getByText} = render(<ComponentThree />)

  await waitFor(() => getByText('toggle'))
  const toggleButton = getByText('toggle')

  // Close container, so containerRef and initialFocusRef elements are no longer rendered
  await user.click(toggleButton)

  expect(document.activeElement).toEqual(toggleButton)
})
