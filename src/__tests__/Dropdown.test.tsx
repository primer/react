import React from 'react'
import {Dropdown} from '../deprecated'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Dropdown', () => {
  behavesAsComponent({Component: Dropdown, toRender: () => <Dropdown>Hello!</Dropdown>})

  checkExports('deprecated/Dropdown', {
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
    toRender: () => <Dropdown.Item>Hello!</Dropdown.Item>
  })
})

describe('Dropdown.Button', () => {
  behavesAsComponent({
    Component: Dropdown.Button,
    toRender: () => <Dropdown.Button>Hello!</Dropdown.Button>
  })
})

describe('Dropdown.Caret', () => {
  behavesAsComponent({Component: Dropdown.Caret})
})

describe('Dropdown.Menu', () => {
  behavesAsComponent({
    Component: Dropdown.Menu,
    toRender: () => (
      <Dropdown.Menu>
        <li key="a">1</li>
        <li key="b">2</li>
        <li key="c">3</li>
      </Dropdown.Menu>
    )
  })
})
