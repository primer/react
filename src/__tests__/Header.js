import React from 'react'
import {Header} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {BORDER, COMMON, TYPOGRAPHY} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Header', () => {
  behavesAsComponent(Header, [COMMON, BORDER])

  checkExports('Header', {
    default: Header
  })

  describe('Header.Item', () => {
    behavesAsComponent(Header.Item, [COMMON, BORDER])
  })

  describe('Header.Link', () => {
    behavesAsComponent(Header.Link, [COMMON, BORDER, TYPOGRAPHY])
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
      <Header>
        <Header.Item full>
          <Header.Link href="#">One</Header.Link>
        </Header.Item>
        <Header.Item>
          <Header.Link href="#">Two</Header.Link>
        </Header.Item>
        <Header.Item>Three</Header.Item>
      </Header>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('renders a <nav> and <a>', () => {
    expect(render(<Header />).type).toEqual('div')
    expect(render(<Header.Link />).type).toEqual('a')
  })

  it('sets aria-label appropriately', () => {
    expect(render(<Header aria-label="foo" />).props['aria-label']).toEqual('foo')
  })
})
