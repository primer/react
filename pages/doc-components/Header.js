import React from 'react'
import Octicon, {MarkGithub} from '@githubprimer/octicons-react'
import NextLink from 'next/link'
import {Text, FlexContainer, Link, Box, Button} from '../../src'
import {name, repository, version} from '../../package.json'

const pkg = `${name}@${version}`
const releaseURL = `https://github.com/${repository}/releases/v${version}`

const Header = () => (
  <FlexContainer mr={1} p={1} alignItems="center" justifyContent="space-between" bg="black" color="white">
    <FlexContainer ml={4} alignItems="center">
      <Octicon size="medium" icon={MarkGithub} className="mr-3" />
      <Text>Primer-react</Text>
    </FlexContainer>
    <div>
      <NextLink href="/docs">
        <Button linkStyle color="white" py={3} px={4}>
          Docs
        </Button>
      </NextLink>
      <NextLink href="/dev-mode">
        <Button linkStyle color="white" py={3} px={4}>
          Dev mode
        </Button>
      </NextLink>
      <NextLink href="/demos">
        <Button linkStyle color="white" py={3} px={4}>
          Demos
        </Button>
      </NextLink>
      <NextLink href="/sandbox">
        <Button linkStyle color="white" py={3} mr={0} px={4}>
          Sandbox
        </Button>
      </NextLink>
    </div>
  </FlexContainer>
)

export default Header
