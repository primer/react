import Octicon, {MarkGithub} from '@githubprimer/octicons-react'
import {UnderlineNav, UnderlineNavLink, Text, Link, FlexContainer, Box} from '../../src'
import {name, repository, version} from '../../package.json'

const pkg = `${name}@${version}`
const releaseURL = `https://github.com/${repository}/releases/v${version}`

const Header = () =>
  <UnderlineNav
    actions={
      <div>
        <UnderlineNavLink px={4} className="d-inline-block" href="/docs">
          Docs
        </UnderlineNavLink>
        <UnderlineNavLink px={4} className="d-inline-block" href="/dev-mode">
          Dev mode
        </UnderlineNavLink>
        <UnderlineNavLink px={4} className="d-inline-block" href="/demos">
          Demos
        </UnderlineNavLink>
        <UnderlineNavLink mr={0} px={4} className="d-inline-block" href="/sandbox">
          Sandbox
        </UnderlineNavLink>
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
