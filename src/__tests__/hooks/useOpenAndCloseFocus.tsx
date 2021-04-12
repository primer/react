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

it('should focus element passed into function', async () => {
  const {getByText} = render(<Component />)
  await waitFor(() => getByText('no'))
  const noButton = getByText('no')
  expect(document.activeElement).toEqual(noButton)
})
