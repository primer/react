// @vitest-environment node
import type React from 'react'
import {renderToString} from 'react-dom/server'
import {describe, expect, it} from 'vitest'
import {NavList} from './NavList'

describe('NavList on the server', () => {
  it('renders wrapped groups as list items with their headings associated before hydration', () => {
    function WrappedHeading(props: React.ComponentPropsWithoutRef<typeof NavList.GroupHeading>) {
      return <NavList.GroupHeading {...props} />
    }

    function WrappedGroup() {
      return (
        <NavList.Group
          heading={
            <WrappedHeading id="settings-heading" as="h2">
              Settings
            </WrappedHeading>
          }
        >
          <NavList.Item href="#general">General</NavList.Item>
        </NavList.Group>
      )
    }

    const html = renderToString(
      <NavList aria-label="Repository">
        <WrappedGroup />
      </NavList>,
    )

    expect(html).toMatch(/<ul[^>]*><li[^>]*><section/)
    expect(html).toMatch(/<h2[^>]*id="settings-heading"[^>]*>Settings<\/h2>/)
    expect(html).toMatch(/<ul[^>]*aria-labelledby="settings-heading"/)
  })
})
