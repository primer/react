import {render} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
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
  render(<Component />)
  await expect.element(page.getByRole('button', {name: 'no', exact: true})).toHaveFocus()
})

it('should focus first element when no initialFocusRef prop is passed', async () => {
  render(<ComponentTwo />)
  await expect.element(page.getByRole('button', {name: 'yes', exact: true})).toHaveFocus()
})

it('should not focus any element if preventFocusOnOpen prop is passed', async () => {
  render(<ComponentThree />)
  expect(document.activeElement).toEqual(document.body)
})

it('should focus returnFocusRef element when rendered', async () => {
  render(<ComponentThree />)
  const toggleButton = page.getByRole('button', {name: 'toggle', exact: true})

  // Close container, so containerRef and initialFocusRef elements are no longer rendered
  await userEvent.click(toggleButton)

  await expect.element(toggleButton).toHaveFocus()
})

describe('preventFocusOnClose', () => {
  it.each([undefined, false, true])('controls restoration when set to %s', async preventFocusOnClose => {
    const returnFocusRef = createRef<HTMLButtonElement>()
    const {rerender} = render(
      <>
        <button type="button" ref={returnFocusRef}>
          trigger
        </button>
        <FocusContainer returnFocusRef={returnFocusRef} preventFocusOnClose={preventFocusOnClose} />
      </>,
    )

    await expect.element(page.getByRole('button', {name: 'first item', exact: true})).toHaveFocus()

    rerender(
      <button type="button" ref={returnFocusRef}>
        trigger
      </button>,
    )

    if (preventFocusOnClose) {
      await expect.element(page.getByRole('button', {name: 'trigger', exact: true})).not.toHaveFocus()
    } else {
      await expect.element(page.getByRole('button', {name: 'trigger', exact: true})).toHaveFocus()
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
    const {rerender} = render(example(!preventFocusOnClose))

    await userEvent.click(page.getByRole('button', {name: 'second item', exact: true}))
    rerender(example(preventFocusOnClose))
    await expect.element(page.getByRole('button', {name: 'second item', exact: true})).toHaveFocus()

    rerender(
      <button type="button" ref={returnFocusRef}>
        trigger
      </button>,
    )

    if (preventFocusOnClose) {
      await expect.element(page.getByRole('button', {name: 'trigger', exact: true})).not.toHaveFocus()
    } else {
      await expect.element(page.getByRole('button', {name: 'trigger', exact: true})).toHaveFocus()
    }
  })
})
