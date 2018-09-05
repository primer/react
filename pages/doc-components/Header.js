import React from 'react'
import Octicon, {MarkGithub} from '@githubprimer/octicons-react'
import NextLink from 'next/link'
import {Text, FlexContainer, Button, Link, Sticky} from '../../src'

const Header = () => (
  <Sticky zIndex={100}>
    <FlexContainer p={1} alignItems="center" justifyContent="space-between" bg="black" color="white">
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
          <Button linkStyle color="white" py={3} px={4}>
            Docs
          </Button>
        </NextLink>
        <NextLink href="/components/dev-mode">
          <Button linkStyle color="white" py={3} px={4}>
            Dev mode
          </Button>
        </NextLink>
        <NextLink href="/components/sandbox">
          <Button linkStyle color="white" py={3} mr={0} px={4}>
            Sandbox
          </Button>
        </NextLink>
      </div>
    </FlexContainer>
  </Sticky>
)

export default Header
