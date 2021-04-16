import React, {useRef} from 'react'
import {render, waitFor} from '@testing-library/react'
import {useOpenAndCloseFocus} from '../../hooks/useOpenAndCloseFocus'

const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLButtonElement>(null)
  const noButtonRef = useRef<HTMLButtonElement>(null)
  useOpenAndCloseFocus({containerRef, initialFocusRef: noButtonRef, returnFocusRef})
  return (
    <>
      <button ref={returnFocusRef}>trigger</button>
      <div ref={containerRef}>
        <button>yes</button>
        <button ref={noButtonRef}>no</button>
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
      <button ref={buttonRef}>button trigger</button>
      <div ref={containerRef}>
        <button>yes</button>
        <button>no</button>
      </div>
    </>
  )
}

it('should focus element passed into function', async () => {
  const {getByText} = render(<Component />)
  await waitFor(() => getByText('no'))
  const noButton = getByText('no')
  expect(document.activeElement).toEqual(noButton)
})

it('should focus first element when nothing is passed', async () => {
  const {getByText} = render(<ComponentTwo />)
  await waitFor(() => getByText('yes'))
  const yesButton = getByText('yes')
  expect(document.activeElement).toEqual(yesButton)
})
