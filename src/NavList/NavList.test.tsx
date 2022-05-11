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
