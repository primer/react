import Octicon, {MarkGithub} from '@githubprimer/octicons-react'
import NextLink from 'next/link'
import {Text, FlexContainer, Link, Box} from '../../src'
import {name, repository, version} from '../../package.json'

const pkg = `${name}@${version}`
const releaseURL = `https://github.com/${repository}/releases/v${version}`

const Header = () =>
  <FlexContainer mr={1} p={2} alignItems="center" justifyContent="space-between" bg="black" color="white">
    <FlexContainer alignItems="center">
      <Octicon size="medium" icon={MarkGithub} className="mr-2" />
      <Text>Primer-react</Text>
    </FlexContainer>
    <div>
      <NextLink href="/docs">
        <Link color="white" px={4} className="d-inline-block text-white">
          Docs
        </Link>
      </NextLink>
      <NextLink href="/dev-mode">
        <Link px={4} className="d-inline-block text-white">
          Dev mode
        </Link>
      </NextLink>
      <NextLink href="/demos">
        <Link color="white" px={4} className="d-inline-block text-white">
          Demos
        </Link>
      </NextLink>
      <NextLink  href="/sandbox">
        <Link color="white" mr={0} px={4} className="d-inline-block text-white">
          Sandbox
        </Link>
      </NextLink>
    </div>
  </FlexContainer>


export default Header
