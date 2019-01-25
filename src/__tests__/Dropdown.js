import React from 'react'
import Dropdown from '../Dropdown'
import {render} from '../utils/testing'
import {COMMON} from '../constants'

describe('Dropdown', () => {
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
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </Dropdown.Menu>
      )
    ).toMatchSnapshot()
    expect(
      render(
        <Dropdown.Menu>
          <li>1</li>
          <li>2</li>
          <li>3</li>
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

describe('Dropdown.Button', () => {
  it('matches the snapshots', () => {
    expect(render(<Dropdown.Button>hi</Dropdown.Button>)).toMatchSnapshot()
    expect(render(<Dropdown.Button>hello!</Dropdown.Button>)).toMatchSnapshot()
  })

  it('implements system props', () => {
    expect(Dropdown.Button).toImplementSystemProps(COMMON)
  })

  it('has default theme', () => {
    expect(Dropdown.Button).toSetDefaultTheme()
  })
})
