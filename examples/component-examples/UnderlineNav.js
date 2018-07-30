/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {NavLink} from 'react-router-dom'
import ExampleHeading from '../doc-components/ExampleHeading'
import {Block, Link, Text, UnderlineNav, UnderlineNavLink} from '../../src'

const underlineNavLinkExample = `<UnderlineNav>
  <UnderlineNavLink href="#foo" selected>
    Selected
  </UnderlineNavLink>
  <UnderlineNavLink href="#bar">Bar</UnderlineNavLink>
  <UnderlineNavLink href="#baz">Baz</UnderlineNavLink>
</UnderlineNav>`

const navLinkExample = `<UnderlineNav>
  <UnderlineNavLink tag={NavLink} to="#foo">Foo</UnderlineNavLink>
  <UnderlineNavLink tag={NavLink} to="#bar">Two</UnderlineNavLink>
  <UnderlineNavLink tag={NavLink} to="/">Selected</UnderlineNavLink>
</UnderlineNav>`

export default {
  name: 'UnderlineNav',
  element: (
    <div>
      <Block mb={4}>
        <ExampleHeading>
          Using <Text fontFamily="mono">{'<UnderlineNavLink>'}</Text>
        </ExampleHeading>
        <LiveEditor code={underlineNavLinkExample} scope={{UnderlineNav, UnderlineNavLink}} />
      </Block>

      <Block mb={4}>
        <ExampleHeading>
          Using <Text fontFamily="mono">{'<NavLink>'}</Text> from react-router
        </ExampleHeading>
        <p>
          To use UnderlineNav with <Link href="https://github.com/ReactTraining/react-router">react-router</Link> or{' '}
          <Link href="https://www.npmjs.com/package/react-router-dom">react-router-dom</Link>, pass{' '}
          <Text fontFamily="mono">{'tag={NavLink}'}</Text> and omit the <Text fontFamily="mono">selected</Text> prop. This ensures that the
          NavLink gets <Text fontFamily="mono">activeClassName='selected'</Text>.
        </p>
        <LiveEditor code={navLinkExample} scope={{UnderlineNav, UnderlineNavLink, NavLink}} />
      </Block>
    </div>
  )
}
