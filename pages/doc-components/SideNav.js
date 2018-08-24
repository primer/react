import React from 'react'
import {NavLink} from 'mdx-docs'
import {Text, Link, Box} from '../../src'

const SideNav = () =>
  <Box mt={4} ml={4}>
    <NavLink href="/getting-started">Getting Started</NavLink>
    <NavLink href="/system-props">System Props</NavLink>
    <NavLink href="/primer-theme">Primer Theme</NavLink>
    <Box mt={2} mb={3}><Text fontWeight='bold'>Components</Text></Box>
    <Box mb={1}><Link nounderline scheme="gray-dark" pl={4} href="/components/avatar">Avatar</Link></Box>
  </Box>

export default SideNav
