/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {NavLink} from 'react-router-dom'
import ExampleHeading from '../doc-components/ExampleHeading'
import {Block, Text, UnderlineNav, UnderlineNavLink} from '../../src'

const underlineNavLinkExample =
`<UnderlineNav>
  <UnderlineNavLink href="#foo" selected>
    Selected
  </UnderlineNavLink>
  <UnderlineNavLink href="#bar">Bar</UnderlineNavLink>
  <UnderlineNavLink href="#baz">Baz</UnderlineNavLink>
</UnderlineNav>`

const linkTagExample =
`<UnderlineNav>
  <a href="#foo">Foo</a>
  <a href="#bar" selected>
    Selected
  </a>
  <a href="#baz">Baz</a>
</UnderlineNav>`

const navLinkExample =
`<UnderlineNav>
  <NavLink to="#foo">Foo</NavLink>
  <NavLink to="#bar">Two</NavLink>
  <NavLink to="/">Selected</NavLink>
</UnderlineNav>`

export default {
  name: 'UnderlineNav',
  element: (
    <div>
      <Block mb={4}>
        <ExampleHeading>
          Using <Text mono>{'<UnderlineNavLink>'}</Text>
        </ExampleHeading>
        <LiveEditor code={underlineNavLinkExample} scope={{UnderlineNav, UnderlineNavLink}} />
      </Block>

      <Block mb={4}>
        <ExampleHeading>
          Using <Text mono>{'<a>'}</Text> tags
        </ExampleHeading>
        <LiveEditor code={linkTagExample} scope={{UnderlineNav}} />
      </Block>

      <Block mb={4}>
        <ExampleHeading>
          Using <Text mono>{'<NavLink>'}</Text> from react-router
        </ExampleHeading>
        <LiveEditor code={navLinkExample} scope={{UnderlineNav, NavLink}} />
      </Block>
    </div>
  )
}
