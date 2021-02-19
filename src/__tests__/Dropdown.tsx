import React from 'react'
import {Dropdown} from '..'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Dropdown', () => {
  behavesAsComponent({Component: Dropdown, systemPropArray: [COMMON], toRender: () => <Dropdown>Hello!</Dropdown>})

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
  behavesAsComponent({
    Component: Dropdown.Item,
    systemPropArray: [COMMON],
    toRender: () => <Dropdown.Item>Hello!</Dropdown.Item>
  })
})

describe('Dropdown.Button', () => {
  behavesAsComponent({
    Component: Dropdown.Button,
    systemPropArray: [COMMON],
    toRender: () => <Dropdown.Button>Hello!</Dropdown.Button>
  })
})

describe('Dropdown.Caret', () => {
  behavesAsComponent({Component: Dropdown.Caret, systemPropArray: [COMMON]})
})

describe('Dropdown.Menu', () => {
  behavesAsComponent({
    Component: Dropdown.Menu,
    systemPropArray: [COMMON],
    toRender: () => (
      <Dropdown.Menu>
        <li key="a">1</li>
        <li key="b">2</li>
        <li key="c">3</li>
      </Dropdown.Menu>
    )
  })
})
