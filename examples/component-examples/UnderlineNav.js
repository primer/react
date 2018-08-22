/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {NavLink} from 'react-router-dom'
import {ExampleHeading} from '../doc-components'
import {Box, Link, Text, UnderlineNav, UnderlineNavLink} from '../../src'

const underlineNavLinkExample = `<UnderlineNav>
  <UnderlineNavLink href="#foo" selected>
    Selected
  </UnderlineNavLink>
  <UnderlineNavLink href="#bar">Bar</UnderlineNavLink>
  <UnderlineNavLink href="#baz">Baz</UnderlineNavLink>
</UnderlineNav>`

const navLinkExample = `<UnderlineNav>
  <UnderlineNavLink is={NavLink} to="#foo">Foo</UnderlineNavLink>
  <UnderlineNavLink is={NavLink} to="#bar">Two</UnderlineNavLink>
  <UnderlineNavLink is={NavLink} to="/">Selected</UnderlineNavLink>
</UnderlineNav>`

export default {
  name: 'UnderlineNav',
  element: (
    <div>
      <Box mb={4}>
        <ExampleHeading>
          Using <Text fontFamily="mono">{'<UnderlineNavLink>'}</Text>
        </ExampleHeading>
        <LiveEditor code={underlineNavLinkExample} scope={{UnderlineNav, UnderlineNavLink}} />
      </Box>

      <Box mb={4}>
        <ExampleHeading>
          Using <Text fontFamily="mono">{'<NavLink>'}</Text> from react-router
        </ExampleHeading>
        <p>
          To use UnderlineNav with <Link href="https://github.com/ReactTraining/react-router">react-router</Link> or{' '}
          <Link href="https://www.npmjs.com/package/react-router-dom">react-router-dom</Link>, pass{' '}
          <Text fontFamily="mono">{'is={NavLink}'}</Text> and omit the <Text fontFamily="mono">selected</Text> prop.
          This ensures that the NavLink gets <Text fontFamily="mono">activeClassName='selected'</Text>.
        </p>
        <LiveEditor code={navLinkExample} scope={{UnderlineNav, UnderlineNavLink, NavLink}} />
      </Box>
    </div>
  )
}
