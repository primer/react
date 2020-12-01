import React from 'react'
import {Dropdown} from '..'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Dropdown', () => {
  behavesAsComponent(Dropdown, [COMMON], () => <Dropdown>Hello!</Dropdown>)

  checkExports('Dropdown', {
    default: Dropdown
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Dropdown />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})

describe('Dropdown.Item', () => {
  behavesAsComponent(Dropdown.Item, [COMMON], () => <Dropdown.Item>Hello!</Dropdown.Item>)
})

describe('Dropdown.Button', () => {
  behavesAsComponent(Dropdown.Button, [COMMON], () => <Dropdown.Button>Hello!</Dropdown.Button>)
})

describe('Dropdown.Caret', () => {
  behavesAsComponent(Dropdown.Caret, [COMMON])
})

describe('Dropdown.Menu', () => {
  behavesAsComponent(Dropdown.Menu, [COMMON], () => (
    <Dropdown.Menu>
      <li key="a">1</li>
      <li key="b">2</li>
      <li key="c">3</li>
    </Dropdown.Menu>
  ))
})
