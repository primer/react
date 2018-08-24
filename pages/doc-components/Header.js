import Octicon, {Package} from '@githubprimer/octicons-react'
import {UnderlineNav, UnderlineNavLink, Text, Link} from '../../src'
import {name, repository, version} from '../../package.json'

const pkg = `${name}@${version}`
const releaseURL = `https://github.com/${repository}/releases/v${version}`

const Header = () =>
  <UnderlineNav
    actions={
      <Text color="gray.5" fontFamily="mono" px={4}>
        <Octicon icon={Package} className="mr-2" />
        <Link href={releaseURL}>{pkg}</Link>
      </Text>
    }
    mr={1}
  >
    <UnderlineNavLink href="/demos" px={3}>
      Demos
    </UnderlineNavLink>
    <UnderlineNavLink href="/sandbox" px={3}>
      Sandbox
    </UnderlineNavLink>
  </UnderlineNav>


export default Header
