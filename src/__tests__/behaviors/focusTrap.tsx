/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import {fireEvent, render} from '@testing-library/react'
import {focusTrap} from '../../behaviors/focusTrap'

it('Should initially focus the first focusable element when activated', () => {
  const {container} = render(
    <div>
      <button tabIndex={0}>Bad Apple</button>
      <div id="trapContainer">
        <button tabIndex={0}>Apple</button>
        <button tabIndex={0}>Banana</button>
        <button tabIndex={0}>Cantaloupe</button>
      </div>
    </div>
  )

  const trapContainer = container.querySelector<HTMLElement>('#trapContainer')!
  const firstButton = trapContainer.querySelector('button')!
  const controller = focusTrap(trapContainer)
  expect(document.activeElement).toEqual(firstButton)

  controller.abort()
})

it('Should initially focus the initialFocus element when specified', () => {
  const {container} = render(
    <div id="trapContainer">
      <button tabIndex={0}>Apple</button>
      <button tabIndex={0}>Banana</button>
      <button tabIndex={0}>Cantaloupe</button>
    </div>
  )

  const trapContainer = container.querySelector<HTMLElement>('#trapContainer')!
  const secondButton = trapContainer.querySelectorAll('button')[1]!
  const controller = focusTrap(trapContainer, secondButton)
  expect(document.activeElement).toEqual(secondButton)

  controller.abort()
})

it('Should prevent focus from exiting the trap, returns focus to previously-focused element', async () => {
  const {container} = render(
    <div>
      <div id="trapContainer">
        <button tabIndex={0}>Apple</button>
        <button tabIndex={0}>Banana</button>
        <button tabIndex={0}>Cantaloupe</button>
      </div>
      <button id="durian" tabIndex={0}>
        Durian
      </button>
    </div>
  )

  const trapContainer = container.querySelector<HTMLElement>('#trapContainer')!
  const firstButton = trapContainer.querySelector('button')!
  const secondButton = trapContainer.querySelectorAll('button')[1]!
  const durianButton = container.querySelector<HTMLElement>('#durian')!
  const controller = focusTrap(trapContainer)

  focus(durianButton)
  expect(document.activeElement).toEqual(firstButton)

  focus(secondButton)
  expect(document.activeElement).toEqual(secondButton)

  focus(durianButton)
  expect(document.activeElement).toEqual(secondButton)

  controller.abort()
})

it('Should cycle focus from last element to first element and vice-versa', async () => {
  const {container} = render(
    <div>
      <div id="trapContainer">
        <button tabIndex={0}>Apple</button>
        <button tabIndex={0}>Banana</button>
        <button tabIndex={0}>Cantaloupe</button>
      </div>
      <button id="durian" tabIndex={0}>
        Durian
      </button>
    </div>
  )

  const trapContainer = container.querySelector<HTMLElement>('#trapContainer')!
  const firstButton = trapContainer.querySelector('button')!
  const lastButton = trapContainer.querySelectorAll('button')[2]!

  const controller = focusTrap(trapContainer)

  lastButton.focus()
  fireEvent(lastButton, new KeyboardEvent('keydown', {bubbles: true, key: 'Tab'}))
  expect(document.activeElement).toEqual(firstButton)

  fireEvent(firstButton, new KeyboardEvent('keydown', {bubbles: true, key: 'Tab', shiftKey: true}))
  expect(document.activeElement).toEqual(lastButton)

  controller.abort()
})

it('Should should release the trap when the signal is aborted', async () => {
  const {container} = render(
    <div>
      <div id="trapContainer">
        <button tabIndex={0}>Apple</button>
        <button tabIndex={0}>Banana</button>
        <button tabIndex={0}>Cantaloupe</button>
      </div>
      <button id="durian" tabIndex={0}>
        Durian
      </button>
    </div>
  )

  const trapContainer = container.querySelector<HTMLElement>('#trapContainer')!
  const durianButton = container.querySelector<HTMLElement>("#durian")!
  const firstButton = trapContainer.querySelector('button')!

  const controller = focusTrap(trapContainer)

  focus(durianButton)
  expect(document.activeElement).toEqual(firstButton)

  controller.abort()

  focus(durianButton)
  expect(document.activeElement).toEqual(durianButton)
})

/**
 * Helper to handle firing the focusin event, which jest/JSDOM does not do for us.
 * @param element
 */
function focus(element: HTMLElement) {
  element.focus()
  fireEvent(element, new FocusEvent('focusin', {bubbles: true}))
}
