import React from 'react'
import {default as NextLink} from 'next/link'
import {Text, Box, Button, Link, FlexContainer, Relative} from '../../src'
import * as docs from '../components'

const SideNav = () => (
  <Relative>
    <Box width={248} bg="gray.0" display="inline-block">
      <FlexContainer p={4} flexDirection="column" alignItems="start" p={5} borderBottom={1} borderColor="gray.2">
        <NextLink href="/getting-started">
          <Link scheme="gray-dark" href="/getting-started" m={0} mb={4}>
            Getting Started
          </Link>
        </NextLink>
        <NextLink href="/system-props">
          <Link scheme="gray-dark" href="/system-props" m={0} mb={4}>
            System Props
          </Link>
        </NextLink>
        <NextLink href="/primer-theme">
          <Link scheme="gray-dark" href="/getting-started" m={0}>
            Primer Theme
          </Link>
        </NextLink>
      </FlexContainer>
      <Box pt={5} pl={5}>
        <Text fontWeight="bold" is="p" color="black" m={0} mb={3}>
          Components
        </Text>
        {Object.values(docs).map(({displayName: name}) => (
          <Box mb={4} key={name}>
            <NextLink href={`/components/${name}`}>
              <Link href={`/components/${name}`} ml={4}>
                {name}
              </Link>
            </NextLink>
          </Box>
        ))}
      </Box>
    </Box>
  </Relative>
)

export default SideNav
