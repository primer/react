import React from 'react'
import Dropdown from '../Dropdown'
import {render} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Dropdown', () => {
  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Dropdown title="open" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('matches the snapshots', () => {
    expect(render(<Dropdown>hi</Dropdown>)).toMatchSnapshot()
    expect(render(<Dropdown title="hi">hello!</Dropdown>)).toMatchSnapshot()
  })

  it('implements system props', () => {
    expect(Dropdown).toImplementSystemProps(COMMON)
  })

  it('has default theme', () => {
    expect(Dropdown).toSetDefaultTheme()
  })
})

describe('Dropdown.Item', () => {
  it('matches the snapshots', () => {
    expect(render(<Dropdown.Item>hi</Dropdown.Item>)).toMatchSnapshot()
    expect(render(<Dropdown.Item>hello!</Dropdown.Item>)).toMatchSnapshot()
  })

  it('implements system props', () => {
    expect(Dropdown.Item).toImplementSystemProps(COMMON)
  })

  it('has default theme', () => {
    expect(Dropdown.Item).toSetDefaultTheme()
  })
})

describe('Dropdown.Menu', () => {
  it('matches the snapshots', () => {
    expect(
      render(
        <Dropdown.Menu>
          <li key="a">1</li>
          <li key="b">2</li>
          <li key="c">3</li>
        </Dropdown.Menu>
      )
    ).toMatchSnapshot()
    expect(
      render(
        <Dropdown.Menu>
          <li key={1}>1</li>
          <li key={2}>2</li>
          <li key={3}>3</li>
        </Dropdown.Menu>
      )
    ).toMatchSnapshot()
  })

  it('implements system props', () => {
    expect(Dropdown.Menu).toImplementSystemProps(COMMON)
  })

  it('has default theme', () => {
    expect(Dropdown.Menu).toSetDefaultTheme()
  })
})
