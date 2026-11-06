import {fireEvent, render} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import {StrictMode, useRef, type PropsWithChildren} from 'react'
import {afterAll, it, expect, vi} from 'vitest'
import {useOnOutsideClick} from '../../hooks/useOnOutsideClick'

afterAll(() => {
  vi.restoreAllMocks()
})

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
  const mockFunction = vi.fn()
  render(<Component callback={mockFunction} />)
  await userEvent.click(page.getByRole('button', {name: 'button', exact: true}))
  expect(mockFunction).toHaveBeenCalledTimes(1)
})

it('should not call function when user right clicks', async () => {
  const mockFunction = vi.fn()
  render(<Component callback={mockFunction} />)
  const button = page.getByRole('button', {name: 'button', exact: true})
  await userEvent.click(button, {button: 'right'})
  expect(mockFunction).toHaveBeenCalledTimes(0)
})

it('should not call function when clicking on ignored refs', async () => {
  const mockFunction = vi.fn()
  render(<Component callback={mockFunction} />)
  await userEvent.click(page.getByRole('button', {name: 'button two', exact: true}))
  expect(mockFunction).toHaveBeenCalledTimes(0)
})

it('should not call function when clicking inside container', async () => {
  const mockFunction = vi.fn()
  render(<Component callback={mockFunction} />)
  await userEvent.click(page.getByText('content', {exact: true}))
  expect(mockFunction).toHaveBeenCalledTimes(0)
})

it('updates the callback without replacing the document listener', () => {
  const firstCallback = vi.fn()
  const nextCallback = vi.fn()
  const {rerender, unmount} = render(<Component callback={firstCallback} />)
  const addListener = vi.spyOn(document, 'addEventListener')
  const removeListener = vi.spyOn(document, 'removeEventListener')

  rerender(<Component callback={nextCallback} />)
  fireEvent.mouseDown(document.body)
  expect(firstCallback).not.toHaveBeenCalled()
  expect(nextCallback).toHaveBeenCalledTimes(1)
  expect(addListener).not.toHaveBeenCalledWith('mousedown', expect.any(Function), {capture: true})
  expect(removeListener).not.toHaveBeenCalledWith('mousedown', expect.any(Function), {capture: true})

  unmount()
  expect(removeListener).toHaveBeenCalledWith('mousedown', expect.any(Function), {capture: true})
  fireEvent.mouseDown(document.body)
  expect(nextCallback).toHaveBeenCalledTimes(1)
})

it('preserves nested handler priority after rerendering in StrictMode', () => {
  const calls: Array<string> = []

  function Layer({name, preventDefault, children}: PropsWithChildren<{name: string; preventDefault?: boolean}>) {
    const containerRef = useRef<HTMLDivElement>(null)
    useOnOutsideClick({
      containerRef,
      onClickOutside(event) {
        calls.push(name)
        if (preventDefault) {
          event.preventDefault()
        }
      },
    })
    return <div ref={containerRef}>{children}</div>
  }

  function Example({preventDefault}: {preventDefault?: boolean}) {
    return (
      <StrictMode>
        <button type="button">Outside</button>
        <Layer name="parent">
          <Layer name="child" preventDefault={preventDefault} />
        </Layer>
      </StrictMode>
    )
  }

  const {rerender, unmount} = render(<Example />)
  fireEvent.mouseDown(page.getByRole('button', {name: 'Outside', exact: true}).element())
  expect(calls).toEqual(['child', 'parent'])

  calls.length = 0
  rerender(<Example preventDefault />)
  fireEvent.mouseDown(page.getByRole('button', {name: 'Outside', exact: true}).element())
  expect(calls).toEqual(['child'])

  calls.length = 0
  unmount()
  fireEvent.mouseDown(document.body)
  expect(calls).toEqual([])
})
