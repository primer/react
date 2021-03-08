import React from 'react'
import {render} from '@testing-library/react'
import { initialFocus } from '../../behaviors/initialFocus'

const Component = () => {
  return (
    <div data-testid="container">
      <button className="one">button one</button>
      <button className="two">button two</button>
    </div>
  )
}

it('should focus element passed into function', async () => {
  const {getByText, getByTestId} =  render(<Component />)
  const buttonTwo = getByText('button two')
  const container = getByTestId("container")
  initialFocus({initialFocusElement: buttonTwo, containerElement: container as HTMLElement})
  expect(document.activeElement).toEqual(buttonTwo)
})


it('should focus the first focusable element if no initial element is passed in', async () => {
  const {getByText, getByTestId} = render(<Component />)
  const buttonOne = getByText('button one')
  const container = getByTestId("container")
  initialFocus({containerElement: container as HTMLElement})
  expect(document.activeElement).toEqual(buttonOne)
})