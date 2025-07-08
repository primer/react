import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {useRef} from 'react'
import {it, expect, vi} from 'vitest'
import {useOnOutsideClick} from '../../hooks/useOnOutsideClick'

type ComponentProps = {
  callback: () => void
}
const Component = ({callback}: ComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const outerButton = useRef<HTMLButtonElement>(null)
  const secondButton = useRef<HTMLButtonElement>(null)
  useOnOutsideClick({ignoreClickRefs: [secondButton], containerRef, onClickOutside: callback})
  return (
    <div>
      <button ref={outerButton} type="button">
        button
      </button>
      <button ref={secondButton} type="button">
        button two
      </button>
      <div ref={containerRef}>content</div>
    </div>
  )
}
it('should call function when user clicks outside container', async () => {
  const user = userEvent.setup()
  const mockFunction = vi.fn()
  const {getByText} = render(<Component callback={mockFunction} />)
  await user.click(getByText('button'))
  expect(mockFunction).toHaveBeenCalledTimes(1)
})

it('should not call function when user right clicks', async () => {
  const user = userEvent.setup()
  const mockFunction = vi.fn()
  const {getByText} = render(<Component callback={mockFunction} />)
  const button = getByText('button')
  await user.pointer([{target: button}, {keys: '[MouseRight]', target: button}])
  expect(mockFunction).toHaveBeenCalledTimes(0)
})

it('should not call function when clicking on ignored refs', async () => {
  const user = userEvent.setup()
  const mockFunction = vi.fn()
  const {getByText} = render(<Component callback={mockFunction} />)
  await user.click(getByText('button two'))
  expect(mockFunction).toHaveBeenCalledTimes(0)
})

it('should not call function when clicking inside container', async () => {
  const user = userEvent.setup()
  const mockFunction = vi.fn()
  const {getByText} = render(<Component callback={mockFunction} />)
  await user.click(getByText('content'))
  expect(mockFunction).toHaveBeenCalledTimes(0)
})
