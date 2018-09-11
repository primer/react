import React from 'react'
import Octicon, {MarkGithub} from '@githubprimer/octicons-react'
import NextLink from 'next/link'
import {Text, FlexContainer, Link, Sticky} from '../../src'

const Header = () => (
  <Sticky zIndex={100}>
    <FlexContainer p={3} alignItems="center" justifyContent="space-between" bg="black" color="white">
      <NextLink href="/components">
        <Link className="text-white" nounderline href="/components">
          <FlexContainer ml={4} alignItems="center" justifyContent="center">
            <Octicon icon={MarkGithub} size="medium" />
            <Text ml={3}>Primer Components</Text>
          </FlexContainer>
        </Link>
      </NextLink>
      <div>
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
      </div>
    </FlexContainer>
  </Sticky>
)

export default Header
