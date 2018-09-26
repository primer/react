import React from 'react'
import Octicon, {MarkGithub} from '@githubprimer/octicons-react'
import NextLink from 'next/link'
import BoxShadow from './BoxShadow'
import {Text, FlexContainer, Link, Sticky, Box} from '../..'

const Header = () => (
  <Sticky zIndex={100}>
    <BoxShadow py={3} bg="gray.9" color="white">
      <FlexContainer className="p-responsive" alignItems="center" justifyContent="space-between">
        <NextLink href="/components">
          <Link ml={3} className="text-white" nounderline href="/components">
            <FlexContainer alignItems="center" justifyContent="center">
              <Octicon icon={MarkGithub} size="medium" />
              <Text ml={3}>Primer Components</Text>
            </FlexContainer>
          </Link>
        </NextLink>
        <Box display={['none', 'none', 'block']}>
          <NextLink href="/components">
            <Link nounderline className="text-white" href="/components" px={4}>
              Docs
            </Link>
          </NextLink>
          <NextLink href="/components/sandbox">
            <Link nounderline className="text-white" href="/components/sandbox" mr={0} px={4}>
              Sandbox
            </Link>
          </NextLink>
        </Box>
        <Box display={['block', 'block', 'none']}>
          <Link nounderline href="#sidenav">
            <Box
              border={1}
              py="6px"
              px="12px"
              borderRadius={3}
              color="white"
              borderColor="gray.6"
              display="inline-block"
            >
              <Text fontWeight="600" fontSize={1}>Menu</Text>
            </Box>
          </Link>
        </Box>
      </FlexContainer>
    </BoxShadow>
  </Sticky>
)

export default Header
