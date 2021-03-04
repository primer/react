/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import React from 'react'
import {iterateTabbableElements} from '../../utils/iterateTabbable'
import {render} from '@testing-library/react'

it('Should iterate through focusable elements only', () => {
  const {container} = render(
    <div>
      <div>
        <textarea></textarea>
      </div>
      <input />
      <button>Hello</button>
      <p>Not focusable</p>
      <div tabIndex={0}>
        <a tabIndex={-1} href="#boo">
          Not focusable
        </a>
        <a href="#yah">Focusable</a>
      </div>
    </div>
  )

  const focusable = Array.from(iterateTabbableElements(container))
  expect(focusable.length).toEqual(5)
  expect(focusable[0].tagName.toLowerCase()).toEqual('textarea')
  expect(focusable[1].tagName.toLowerCase()).toEqual('input')
  expect(focusable[2].tagName.toLowerCase()).toEqual('button')
  expect(focusable[3].tagName.toLowerCase()).toEqual('div')
  expect(focusable[4].tagName.toLowerCase()).toEqual('a')
  expect(focusable[4].getAttribute('href')).toEqual('#yah')
})

it('Should iterate through focusable elements in reverse', () => {
  const {container} = render(
    <div>
      <div>
        <textarea></textarea>
      </div>
      <input />
      <button>Hello</button>
      <p>Not focusable</p>
      <div tabIndex={0}>
        <a tabIndex={-1} href="#boo">
          Not focusable
        </a>
        <a href="#yah">Focusable</a>
      </div>
    </div>
  )

  const focusable = Array.from(iterateTabbableElements(container, {reverse: true}))
  expect(focusable.length).toEqual(5)
  expect(focusable[0].tagName.toLowerCase()).toEqual('a')
  expect(focusable[0].getAttribute('href')).toEqual('#yah')
  expect(focusable[1].tagName.toLowerCase()).toEqual('div')
  expect(focusable[2].tagName.toLowerCase()).toEqual('button')
  expect(focusable[3].tagName.toLowerCase()).toEqual('input')
  expect(focusable[4].tagName.toLowerCase()).toEqual('textarea')
})
