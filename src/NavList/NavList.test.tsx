import {render} from '@testing-library/react'
import React from 'react'
import {ThemeProvider, SSRProvider} from '..'
import {NavList} from './NavList'

describe('NavList', () => {
  it('renders a simple list', () => {
    const {container} = render(
      <ThemeProvider>
        <SSRProvider>
          <NavList>
            <NavList.Item href="/" aria-current="page">
              Home
            </NavList.Item>
            <NavList.Item href="/about">About</NavList.Item>
            <NavList.Item href="/contact">Contact</NavList.Item>
          </NavList>
        </SSRProvider>
      </ThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with groups', () => {
    const {container} = render(
      <ThemeProvider>
        <SSRProvider>
          <NavList>
            <NavList.Group title="Overview">
              <NavList.Item href="/getting-started" aria-current="page">
                Getting started
              </NavList.Item>
            </NavList.Group>
            <NavList.Group title="Components">
              <NavList.Item href="/Avatar">Avatar</NavList.Item>
            </NavList.Group>
          </NavList>
        </SSRProvider>
      </ThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })
})

describe('NavList.Item', () => {
  it.todo('passes aria-current prop to the underlying <a> element')

  it.todo('has active styles if aria-current is set')
})

describe('NavList.Item with NavList.SubNav', () => {
  it.todo('renders as a button')

  it.todo('ignores aria-current prop')

  it.todo('shows SubNav by default if SubNav contains the current item')

  it.todo('hides SubNav by default if SubNav does not contain the current item')

  it.todo('toggles visiblility of SubNav when clicked')

  it.todo('has active styles if SubNav contains the current item and is closed')

  it.todo('does not have active styles if SubNav contains the current item and is open')

  it.todo('prints an error if Item contains multiple nested SubNavs')
})
