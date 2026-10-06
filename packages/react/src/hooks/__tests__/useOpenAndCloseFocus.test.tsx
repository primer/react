import {render, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, it, expect} from 'vitest'
import {createRef, useRef, useState} from 'react'
import {useOpenAndCloseFocus, type UseOpenAndCloseFocusSettings} from '../../hooks/useOpenAndCloseFocus'

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

function FocusContainer({
  returnFocusRef,
  preventFocusOnClose,
}: Pick<UseOpenAndCloseFocusSettings, 'returnFocusRef' | 'preventFocusOnClose'>) {
  const containerRef = useRef<HTMLDivElement>(null)
  useOpenAndCloseFocus({containerRef, returnFocusRef, preventFocusOnClose})

  return (
    <div ref={containerRef}>
      <button type="button">first item</button>
      <button type="button">second item</button>
    </div>
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

describe('preventFocusOnClose', () => {
  it.each([undefined, false, true])('controls restoration when set to %s', preventFocusOnClose => {
    const returnFocusRef = createRef<HTMLButtonElement>()
    const component = render(
      <>
        <button type="button" ref={returnFocusRef}>
          trigger
        </button>
        <FocusContainer returnFocusRef={returnFocusRef} preventFocusOnClose={preventFocusOnClose} />
      </>,
    )

    expect(component.getByRole('button', {name: 'first item'})).toHaveFocus()

    component.rerender(
      <button type="button" ref={returnFocusRef}>
        trigger
      </button>,
    )

    if (preventFocusOnClose) {
      expect(component.getByRole('button', {name: 'trigger'})).not.toHaveFocus()
    } else {
      expect(component.getByRole('button', {name: 'trigger'})).toHaveFocus()
    }
  })

  it.each([false, true])('uses the updated setting %s without moving focus while open', async preventFocusOnClose => {
    const returnFocusRef = createRef<HTMLButtonElement>()
    const example = (preventFocus: boolean) => (
      <>
        <button type="button" ref={returnFocusRef}>
          trigger
        </button>
        <FocusContainer returnFocusRef={returnFocusRef} preventFocusOnClose={preventFocus} />
      </>
    )
    const component = render(example(!preventFocusOnClose))
    const user = userEvent.setup()

    await user.click(component.getByRole('button', {name: 'second item'}))
    component.rerender(example(preventFocusOnClose))
    expect(component.getByRole('button', {name: 'second item'})).toHaveFocus()

    component.rerender(
      <button type="button" ref={returnFocusRef}>
        trigger
      </button>,
    )

    if (preventFocusOnClose) {
      expect(component.getByRole('button', {name: 'trigger'})).not.toHaveFocus()
    } else {
      expect(component.getByRole('button', {name: 'trigger'})).toHaveFocus()
    }
  })
})
