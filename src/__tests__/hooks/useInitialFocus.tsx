import React, {useRef, useState} from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react'
import {Overlay, Flex, Button} from '../..'
import {useInitialFocus} from '../../hooks/useInitialFocus'
import { colorStyle } from 'styled-system'

const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const returnRef = useRef<HTMLButtonElement>(null)
  const noButtonRef = useRef<HTMLButtonElement>(null)
  useInitialFocus({containerRef, initialFocusRef: noButtonRef, returnRef})
  return (
    <>
      <button ref={returnRef}>trigger</button>
      <div ref={containerRef}>
          <Button>yes</Button>
          <Button ref={noButtonRef}>no</Button>
      </div>
    </>
  )
}

const ComponentTwo = () => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  useInitialFocus({containerRef, returnRef: buttonRef})
  return (
    <>
      <Button ref={buttonRef}>
        button trigger
      </Button>
      <div ref={containerRef}>
          <Button>yes</Button>
          <Button>no</Button>
      </div>
    </>
  )
}

it('should focus element passed into function', async () => {
  const {getByText} =  render(<Component />)
  await waitFor(() => getByText('no'))
  const noButton = getByText('no')
  expect(document.activeElement).toEqual(noButton)
})

it('should focus first element when nothing is passed', async () => {
  const {getByText} =  render(<ComponentTwo />)
  await waitFor(() => getByText('yes'))
  const yesButton = getByText('yes')
  expect(document.activeElement).toEqual(yesButton)
})