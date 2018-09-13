import React from 'react'
import {default as NextLink} from 'next/link'
import {Text, Box, Link, FlexContainer, Relative} from '../../src'
import * as docs from '../components/docs'

const SideNav = () => (
  <Relative>
    <Box width={248} bg="gray.0" display="inline-block">
      <FlexContainer flexDirection="column" alignItems="start" p={5} borderBottom={1} borderColor="gray.2">
        <NextLink href="/components/docs/system-props">
          <Link nounderline scheme="gray-dark" href="/components/docs/system-props" m={0} mb={4}>
            System Props
          </Link>
        </NextLink>
        <NextLink href="/components/docs/primer-theme">
          <Link nounderline scheme="gray-dark" href="/components/docs/primer-theme" m={0}>
            Primer Theme
          </Link>
        </NextLink>
      </FlexContainer>
      <Box pt={5} pl={5}>
        <Text fontWeight="bold" is="p" color="black" m={0} mb={3}>
          <NextLink href="/components/docs/Avatar">
            <Link nounderline scheme="gray-dark" href="/components/docs/Avatar">
              Components
            </Link>
          </NextLink>
        </Text>
        {Object.values(docs).map(({displayName: name}) => (
          <Box mb={4} key={name}>
            <NextLink href={`/components/docs/${name}`}>
              <Link nounderline href={`/components/docs/${name}`} ml={4}>
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
