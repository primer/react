import {useOnEscapePress} from '../../hooks/useOnEscapePress'
import {render, fireEvent} from '@testing-library/react'
import React from 'react'

it('should call function when user presses escape', () => {
  const functionToCall = jest.fn()
  const Component = () => {
    useOnEscapePress(functionToCall)
    return <div>content</div>
  }

  const {getByText} = render(<Component />)
  const domNode = getByText('content')
  fireEvent.keyDown(domNode, {key: 'Escape', code: 'Escape', keyCode: 27, charCode: 27})
  expect(functionToCall).toHaveBeenCalledTimes(1)
})
