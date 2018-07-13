/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react'
import ExampleHeading from '../doc-components/ExampleHeading'
import {Block, Text, UnderlineNav, UnderlineNavLink} from '../../src'
import {NavLink} from 'react-router-dom'

export default {
  name: 'UnderlineNav',
  element: (
    <Block p={4}>
      <Block mb={4}>
        <ExampleHeading>
          Using <Text mono>{'<UnderlineNavLink>'}</Text>
        </ExampleHeading>
        <UnderlineNav>
          <UnderlineNavLink href="#foo" selected>
            Selected
          </UnderlineNavLink>
          <UnderlineNavLink href="#bar">Bar</UnderlineNavLink>
          <UnderlineNavLink href="#baz">Baz</UnderlineNavLink>
        </UnderlineNav>
      </Block>

      <Block mb={4}>
        <ExampleHeading>
          Using <Text mono>{'<a>'}</Text> tags
        </ExampleHeading>
        <UnderlineNav>
          <a href="#foo">Foo</a>
          <a href="#bar" selected>
            Selected
          </a>
          <a href="#baz">Baz</a>
        </UnderlineNav>
      </Block>

      <Block mb={4}>
        <ExampleHeading>
          Using <Text mono>{'<NavLink>'}</Text> from react-router
        </ExampleHeading>
        <UnderlineNav>
          <NavLink to="#foo">Foo</NavLink>
          <NavLink to="#bar">Two</NavLink>
          <NavLink to="/">Selected</NavLink>
        </UnderlineNav>
      </Block>
    </Block>
  )
}
