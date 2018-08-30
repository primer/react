import React from 'react'
import {default as NextLink} from 'next/link'
import {Text, Box, Button} from '../../src'
import * as docs from '../components'

const SideNav = () =>
  <Box mt={4} ml={4} bg="gray.0">
    <NextLink href="/getting-started">
      <Text is="p" fontWeight='bold'>Getting Started</Text>
    </NextLink>
    <NextLink href="/system-props">
      <Text is="p" fontWeight='bold'>System Props</Text>
    </NextLink>
    <NextLink href="/primer-theme">
      <Text is="p" fontWeight='bold'>Primer Theme</Text>
    </NextLink>
    <Box mt={2} mb={3}>
      <Text is="p" fontWeight='bold'>Components</Text>
    </Box>
    {Object.values(docs).map(meta =>
      <Box mb={1}>
        <NextLink key={meta.displayName} href={`/components/${meta.displayName}`}>
          <Button linkStyle pl={4}>{meta.displayName}</Button>
        </NextLink>
      </Box>
    )}
  </Box>

export default SideNav
