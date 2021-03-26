/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import {fireEvent, render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {FocusKeys, focusZone} from '../../behaviors/focusZone'

// Since we use strict `isTabbable` checks within focus trap, we need to mock these
// properties that Jest does not populate.
beforeAll(() => {
  try {
    Object.defineProperties(HTMLElement.prototype, {
      offsetHeight: {
        get: () => 42
      },
      offsetWidth: {
        get: () => 42
      },
      getClientRects: {
        get: () => () => [42]
      }
    })
  } catch {}
})

it('Should allow arrow keys to move focus', () => {
  const {container} = render(
    <div>
      <button tabIndex={0}>Bad Apple</button>
      <div id="focusZone">
        <button tabIndex={0}>Apple</button>
        <button tabIndex={0}>Banana</button>
        <button tabIndex={0}>Cantaloupe</button>
      </div>
    </div>
  )

  const focusZoneContainer = container.querySelector<HTMLElement>('#focusZone')!
  const [firstButton, secondButton] = focusZoneContainer.querySelectorAll('button')!
  const controller = focusZone(focusZoneContainer)

  firstButton.focus()
  expect(document.activeElement).toEqual(firstButton)

  userEvent.type(firstButton, '{arrowdown}')
  expect(document.activeElement).toEqual(secondButton)

  controller.abort()
})

it('Should have one tab-stop inside the focus zone when enabled', () => {
  const {container} = render(
    <div>
      <button tabIndex={0}>Bad Apple</button>
      <div id="focusZone">
        <button tabIndex={0}>Apple</button>
        <button tabIndex={0}>Banana</button>
        <button tabIndex={0}>Cantaloupe</button>
      </div>
      <button tabIndex={0}>Next Apple</button>
    </div>
  )

  const focusZoneContainer = container.querySelector<HTMLElement>('#focusZone')!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [one, two, three, four, five] = container.querySelectorAll('button')!
  const controller = focusZone(focusZoneContainer)

  one.focus()
  userEvent.tab()
  userEvent.tab()
  expect(document.activeElement).toEqual(five)

  controller.abort()
  one.focus()
  userEvent.tab()
  userEvent.tab()
  expect(document.activeElement).toEqual(three)

  controller.abort()
})

it('Should prevent moving focus outside the zone', () => {
  const {container} = render(
    <div>
      <button tabIndex={0}>Bad Apple</button>
      <div id="focusZone">
        <button tabIndex={0}>Apple</button>
        <button tabIndex={0}>Banana</button>
        <button tabIndex={0}>Cantaloupe</button>
      </div>
    </div>
  )

  const focusZoneContainer = container.querySelector<HTMLElement>('#focusZone')!
  const [firstButton, secondButton, thirdButton] = focusZoneContainer.querySelectorAll('button')!
  const controller = focusZone(focusZoneContainer)

  firstButton.focus()
  expect(document.activeElement).toEqual(firstButton)

  userEvent.type(firstButton, '{arrowup}')
  expect(document.activeElement).toEqual(firstButton)

  userEvent.type(firstButton, '{arrowdown}')
  expect(document.activeElement).toEqual(secondButton)

  userEvent.type(secondButton, '{arrowdown}')
  expect(document.activeElement).toEqual(thirdButton)

  userEvent.type(thirdButton, '{arrowdown}')
  expect(document.activeElement).toEqual(thirdButton)

  controller.abort()
})

it('Should do focus wrapping correctly', () => {
  const {container} = render(
    <div>
      <button tabIndex={0}>Bad Apple</button>
      <div id="focusZone">
        <button tabIndex={0}>Apple</button>
        <button tabIndex={0}>Banana</button>
        <button tabIndex={0}>Cantaloupe</button>
      </div>
    </div>
  )

  const focusZoneContainer = container.querySelector<HTMLElement>('#focusZone')!
  const [firstButton, secondButton, thirdButton] = focusZoneContainer.querySelectorAll('button')!
  const controller = focusZone(focusZoneContainer, {focusOutBehavior: 'wrap'})

  firstButton.focus()
  expect(document.activeElement).toEqual(firstButton)

  userEvent.type(firstButton, '{arrowup}')
  expect(document.activeElement).toEqual(thirdButton)

  userEvent.type(firstButton, '{arrowup}')
  expect(document.activeElement).toEqual(secondButton)

  userEvent.type(firstButton, '{arrowdown}')
  expect(document.activeElement).toEqual(thirdButton)

  userEvent.type(firstButton, '{arrowdown}')
  expect(document.activeElement).toEqual(firstButton)

  controller.abort()
})

it('Should call custom getNextFocusable callback', () => {
  const {container} = render(
    <div>
      <button tabIndex={0}>Bad Apple</button>
      <div id="focusZone">
        <button tabIndex={0}>Apple</button>
        <button tabIndex={0}>Banana</button>
        <button tabIndex={0}>Cantaloupe</button>
      </div>
    </div>
  )

  const focusZoneContainer = container.querySelector<HTMLElement>('#focusZone')!
  const [firstButton, secondButton] = focusZoneContainer.querySelectorAll('button')!
  const getNextFocusableCallback = jest.fn()
  const controller = focusZone(focusZoneContainer, {getNextFocusable: getNextFocusableCallback})

  firstButton.focus()
  expect(document.activeElement).toEqual(firstButton)

  userEvent.type(firstButton, '{arrowdown}')
  expect(getNextFocusableCallback).toHaveBeenCalledWith<[string, HTMLElement, any]>(
    'next',
    firstButton,
    expect.anything()
  )

  userEvent.type(secondButton, '{home}')
  expect(getNextFocusableCallback).toHaveBeenCalledWith<[string, HTMLElement, any]>(
    'start',
    secondButton,
    expect.anything()
  )

  controller.abort()
})

it('Should focus-in to the most recently-focused element', () => {
  const {container} = render(
    <div>
      <button tabIndex={0} id="outside">
        Bad Apple
      </button>
      <div id="focusZone">
        <button tabIndex={0}>Apple</button>
        <button tabIndex={0}>Banana</button>
        <button tabIndex={0}>Cantaloupe</button>
      </div>
    </div>
  )

  const focusZoneContainer = container.querySelector<HTMLElement>('#focusZone')!
  const outsideButton = container.querySelector<HTMLElement>('#outside')!
  const [firstButton, secondButton] = focusZoneContainer.querySelectorAll('button')!
  const controller = focusZone(focusZoneContainer)

  firstButton.focus()
  expect(document.activeElement).toEqual(firstButton)

  userEvent.type(firstButton, '{arrowdown}')
  expect(document.activeElement).toEqual(secondButton)

  // make sure focusin is fired because JSDOM
  fireEvent(secondButton, new FocusEvent('focusin', {bubbles: true}))

  outsideButton.focus()
  userEvent.tab()

  expect(document.activeElement).toEqual(secondButton)

  controller.abort()
})

it('Should focus-in to the first element when focusInStrategy is "first"', () => {
  const {container} = render(
    <div>
      <button tabIndex={0} id="outside">
        Bad Apple
      </button>
      <div id="focusZone">
        <button tabIndex={0}>Apple</button>
        <button tabIndex={0}>Banana</button>
        <button tabIndex={0}>Cantaloupe</button>
      </div>
    </div>
  )

  const focusZoneContainer = container.querySelector<HTMLElement>('#focusZone')!
  const outsideButton = container.querySelector<HTMLElement>('#outside')!
  const [firstButton, secondButton] = focusZoneContainer.querySelectorAll('button')!
  const controller = focusZone(focusZoneContainer, {focusInStrategy: 'first'})

  firstButton.focus()
  expect(document.activeElement).toEqual(firstButton)

  userEvent.type(firstButton, '{arrowdown}')
  expect(document.activeElement).toEqual(secondButton)

  // make sure focusin is fired because JSDOM
  fireEvent(secondButton, new FocusEvent('focusin', {bubbles: true, relatedTarget: firstButton}))

  outsideButton.focus()
  userEvent.tab()

  // fire focusin on secondButton, since that actually has tabindex=0. The behavior will then it to the first.
  fireEvent(secondButton, new FocusEvent('focusin', {bubbles: true, relatedTarget: outsideButton}))
  expect(document.activeElement).toEqual(firstButton)

  controller.abort()
})

it('Should call the custom focusInStrategy callback', () => {
  const {container} = render(
    <div>
      <button tabIndex={0} id="outside">
        Bad Apple
      </button>
      <div id="focusZone">
        <button tabIndex={0}>Apple</button>
        <button tabIndex={0}>Banana</button>
        <button tabIndex={0}>Cantaloupe</button>
      </div>
    </div>
  )

  const focusZoneContainer = container.querySelector<HTMLElement>('#focusZone')!
  const outsideButton = container.querySelector<HTMLElement>('#outside')!
  const [firstButton, secondButton] = focusZoneContainer.querySelectorAll('button')!
  const focusInCallback = jest.fn().mockReturnValue(secondButton)
  const controller = focusZone(focusZoneContainer, {focusInStrategy: focusInCallback})

  outsideButton.focus()
  userEvent.tab()
  fireEvent(firstButton, new FocusEvent('focusin', {bubbles: true, relatedTarget: outsideButton}))
  expect(focusInCallback).toHaveBeenCalledWith<[HTMLElement]>(outsideButton)
  expect(document.activeElement).toEqual(secondButton)

  controller.abort()
})

it('Should respect inputs by not moving focus if key would have some other effect', () => {
  const {container} = render(
    <div>
      <button tabIndex={0} id="outside">
        Bad Apple
      </button>
      <div id="focusZone">
        <button tabIndex={0}>Apple</button>
        <input type="text" defaultValue="Banana" tabIndex={0} />
        <button tabIndex={0}>Cantaloupe</button>
      </div>
    </div>
  )

  const focusZoneContainer = container.querySelector<HTMLElement>('#focusZone')!
  const [firstButton, secondButton] = focusZoneContainer.querySelectorAll('button')!
  const input = focusZoneContainer.querySelector<HTMLElement>('input')!
  const controller = focusZone(focusZoneContainer, {bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd})

  firstButton.focus()
  userEvent.type(firstButton, '{arrowright}')
  expect(document.activeElement).toEqual(input)
  userEvent.type(input, '{arrowleft}')
  expect(document.activeElement).toEqual(input)
  userEvent.type(input, '{arrowright}')
  expect(document.activeElement).toEqual(input)
  userEvent.type(input, '{arrowright}')
  expect(document.activeElement).toEqual(secondButton)

  controller.abort()
})

it('Should focus-in to the first element if the last-focused element is removed', () => {
  const {container} = render(
    <div>
      <button tabIndex={0} id="outside">
        Bad Apple
      </button>
      <div id="focusZone">
        <button tabIndex={0}>Apple</button>
        <button tabIndex={0}>Banana</button>
        <button tabIndex={0}>Cantaloupe</button>
      </div>
    </div>
  )

  const focusZoneContainer = container.querySelector<HTMLElement>('#focusZone')!
  const [firstButton, secondButton, thirdButton] = focusZoneContainer.querySelectorAll('button')!
  const outsideButton = container.querySelector<HTMLElement>('#outside')!
  const controller = focusZone(focusZoneContainer)

  firstButton.focus()
  userEvent.type(firstButton, '{arrowdown}')
  expect(document.activeElement).toEqual(secondButton)

  outsideButton.focus()
  focusZoneContainer.removeChild(secondButton)
  userEvent.tab()
  expect(document.activeElement).toEqual(firstButton)

  userEvent.type(firstButton, '{arrowdown}')
  expect(document.activeElement).toEqual(thirdButton)

  controller.abort()
})

it('Should call onActiveDescendantChanged properly', () => {
  const {container} = render(
    <div>
      <button tabIndex={0} id="outside">
        Bad Apple
      </button>
      <input id="control" defaultValue="control input" tabIndex={0} />
      <div id="focusZone">
        <button tabIndex={0}>Apple</button>
        <button tabIndex={0}>Banana</button>
        <button tabIndex={0}>Cantaloupe</button>
      </div>
    </div>
  )

  const focusZoneContainer = container.querySelector<HTMLElement>('#focusZone')!
  const [firstButton, secondButton] = focusZoneContainer.querySelectorAll('button')!
  const control = container.querySelector<HTMLElement>('#control')!
  const activeDescendantChangedCallback = jest.fn()
  const controller = focusZone(focusZoneContainer, {
    activeDescendantControl: control,
    onActiveDescendantChanged: activeDescendantChangedCallback
  })

  control.focus()
  userEvent.type(control, '{arrowdown}')
  expect(activeDescendantChangedCallback).toHaveBeenCalledWith<[HTMLElement | undefined, HTMLElement | undefined]>(
    firstButton,
    undefined
  )
  userEvent.type(control, '{arrowdown}')
  expect(activeDescendantChangedCallback).toHaveBeenCalledWith<[HTMLElement | undefined, HTMLElement | undefined]>(
    secondButton,
    firstButton
  )
  userEvent.type(control, '{arrowup}')
  userEvent.type(control, '{arrowUp}')
  expect(activeDescendantChangedCallback).toHaveBeenCalledWith<[HTMLElement | undefined, HTMLElement | undefined]>(
    undefined,
    firstButton
  )

  controller.abort()
})

it('Should set aria-activedescendant correctly', () => {
  const {container} = render(
    <div>
      <button tabIndex={0} id="outside">
        Bad Apple
      </button>
      <input id="control" defaultValue="control input" tabIndex={0} />
      <div id="focusZone">
        <button tabIndex={0}>Apple</button>
        <button tabIndex={0}>Banana</button>
        <button tabIndex={0}>Cantaloupe</button>
      </div>
    </div>
  )

  const focusZoneContainer = container.querySelector<HTMLElement>('#focusZone')!
  const [firstButton, secondButton] = focusZoneContainer.querySelectorAll('button')!
  const control = container.querySelector<HTMLElement>('#control')!
  const controller = focusZone(focusZoneContainer, {activeDescendantControl: control})

  control.focus()
  userEvent.type(control, '{arrowdown}')
  expect(control.getAttribute('aria-activedescendant')).toEqual(firstButton.id)
  userEvent.type(control, '{arrowdown}')
  expect(control.getAttribute('aria-activedescendant')).toEqual(secondButton.id)
  userEvent.type(control, '{arrowup}')
  expect(control.getAttribute('aria-activedescendant')).toEqual(firstButton.id)
  expect(document.activeElement).toEqual(control)
  userEvent.type(control, '{arrowup}')
  expect(control.hasAttribute('aria-activedescendant')).toBeFalsy()
  expect(document.activeElement).toEqual(control)

  controller.abort()
})
