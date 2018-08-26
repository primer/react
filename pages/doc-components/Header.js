import Octicon, {MarkGithub} from '@githubprimer/octicons-react'
import Link from 'next/link'
import {UnderlineNav, UnderlineNavLink, Text, FlexContainer, Box} from '../../src'
import {name, repository, version} from '../../package.json'

const pkg = `${name}@${version}`
const releaseURL = `https://github.com/${repository}/releases/v${version}`

const Header = () =>
  <UnderlineNav
    actions={
      <div>
        <Link href="/docs">
          <UnderlineNavLink px={4} className="d-inline-block">
            Docs
          </UnderlineNavLink>
        </Link>
        <Link href="/dev-mode">
          <UnderlineNavLink px={4} className="d-inline-block">
            Dev mode
          </UnderlineNavLink>
        </Link>
        <Link href="/demos">
          <UnderlineNavLink px={4} className="d-inline-block">
            Demos
          </UnderlineNavLink>
        </Link>
        <Link  href="/sandbox">
          <UnderlineNavLink mr={0} px={4} className="d-inline-block">
            Sandbox
          </UnderlineNavLink>
        </Link>
      </div>
    }
    mr={1}
  >
    <FlexContainer alignItems="center" ml={5}>
      <Octicon size="medium" icon={MarkGithub} className="mr-2" />
      <Text color="black" fontWeight="bold">Primer-react</Text>
    </FlexContainer>
  </UnderlineNav>


export default Header
