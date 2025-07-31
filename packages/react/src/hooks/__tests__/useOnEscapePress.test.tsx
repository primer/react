import {render, fireEvent} from '@testing-library/react'
import {it, expect, vi} from 'vitest'
import {useOnEscapePress} from '../../hooks/useOnEscapePress'

it('should call function when user presses escape', () => {
  const functionToCall = vi.fn()
  const Component = () => {
    useOnEscapePress(functionToCall)
    return <div>content</div>
  }

  const {getByText} = render(<Component />)
  const domNode = getByText('content')
  fireEvent.keyDown(domNode, {key: 'Escape', code: 'Escape', keyCode: 27, charCode: 27})
  expect(functionToCall).toHaveBeenCalledTimes(1)
})
