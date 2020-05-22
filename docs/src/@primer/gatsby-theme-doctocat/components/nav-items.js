import {BorderBox, Flex, Link, StyledOcticon, themeGet} from '@primer/components'
import {LinkExternal} from '@primer/octicons-react'
import {Link as GatsbyLink} from 'gatsby'
import preval from 'preval.macro'
import React from 'react'
import styled from 'styled-components'

// This code needs to run at build-time so it can access the file system.
const repositoryUrl = preval`
  const readPkgUp = require('read-pkg-up')
  const getPkgRepo = require('get-pkg-repo')
  try {
    const repo = getPkgRepo(readPkgUp.sync().package)
    module.exports = \`https://github.com/\${repo.user}/\${repo.project}\`
  } catch (error) {
    module.exports = ''
  }
`

const NavLink = styled(Link)`
  &.active {
    font-weight: ${themeGet('fontWeights.bold')};
    color: ${themeGet('colors.gray.8')};
  }
`

function NavItems({items}) {
  return (
    <>
      {items.map(item => (
        <BorderBox key={item.title} borderWidth={0} borderRadius={0} borderTopWidth={1} p={4}>
          <Flex flexDirection="column">
            <NavLink as={GatsbyLink} to={item.url} activeClassName="active" partiallyActive color="inherit">
              {item.title}
            </NavLink>
            {item.children ? (
              <Flex flexDirection="column" mt={2}>
                {item.children.map(child => (
                  <NavLink
                    key={child.title}
                    as={GatsbyLink}
                    to={child.url}
                    activeClassName="active"
                    display="block"
                    py={1}
                    mt={2}
                    fontSize={1}
                  >
                    {child.title}
                  </NavLink>
                ))}
              </Flex>
            ) : null}
          </Flex>
        </BorderBox>
      ))}
      {repositoryUrl ? (
        <BorderBox borderWidth={0} borderRadius={0} borderTopWidth={1} p={4}>
          <Link href={repositoryUrl} color="inherit">
            <Flex justifyContent="space-between" alignItems="center">
              GitHub
              <StyledOcticon icon={LinkExternal} color="gray.7" />
            </Flex>
          </Link>
        </BorderBox>
      ) : null}
    </>
  )
}

export default NavItems
