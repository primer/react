import React from 'react'
import {default as NextLink} from 'next/link'
import {Text, Box, Button, FlexContainer} from '../../src'
import * as docs from '../components'

const SideNav = () =>
  <Box bg="gray.0">
    <FlexContainer flexDirection="column" alignItems="start" p={5} borderBottom={1} borderColor="gray.2">
      <NextLink href="/getting-started">
        <Button linkStyle color="black" m={0} mb={3}>Getting Started</Button>
      </NextLink>
      <NextLink href="/system-props">
        <Button linkStyle color="black" m={0} mb={3}>System Props</Button>
      </NextLink>
      <NextLink href="/primer-theme">
        <Button linkStyle color="black" m={0}>Primer Theme</Button>
      </NextLink>
    </FlexContainer>
    <Box pt={5} pl={5}>
      <Text fontWeight="bold" is="p" color="black" m={0} mb={3}>Components</Text>
      {Object.values(docs).map(meta =>
        <Box mb={1}>
          <NextLink key={meta.displayName} href={`/components/${meta.displayName}`}>
            <Button linkStyle m={2} ml={4}>{meta.displayName}</Button>
          </NextLink>
        </Box>
      )}
    </Box>
  </Box>

export default SideNav
