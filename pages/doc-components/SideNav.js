import React from 'react'
import Link from 'next/link'
import {Text, Box} from '../../src'
import * as docs from '../components'

const SideNav = () =>
  <Box mt={4} ml={4}>
    <Link href="/getting-started">
      <Text is="p" fontWeight='bold'>Getting Started</Text>
    </Link>
    <Link href="/system-props">
      <Text is="p" fontWeight='bold'>System Props</Text>
    </Link>
    <Link href="/primer-theme">
      <Text is="p" fontWeight='bold'>Primer Theme</Text>
    </Link>
    <Box mt={2} mb={3}>
      <Text is="p" fontWeight='bold'>Components</Text>
    </Box>
    {Object.values(docs).map(meta =>
      <Box mb={1}>
        <Link key={meta.slug} href={`/components/${meta.displayName}`}>
          <Text color="black" pl={4}>{meta.displayName}</Text>
        </Link>
      </Box>
    )}
  </Box>

export default SideNav
