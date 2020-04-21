import {BorderBox, Flex, Position} from '@primer/components'
import React from 'react'
import navItems from '@primer/gatsby-theme-doctocat/src/nav.yml'
import {HEADER_HEIGHT} from '@primer/gatsby-theme-doctocat/src/components/header'
import NavItems from '@primer/gatsby-theme-doctocat/src/components/nav-items'

function Sidebar() {
  return (
    <Position
      position="sticky"
      top={HEADER_HEIGHT}
      height={`calc(100vh - ${HEADER_HEIGHT}px)`}
      minWidth={260}
      color="gray.8"
      bg="gray.0"
    >
      <BorderBox borderWidth={0} borderRightWidth={1} borderRadius={0} height="100%" style={{overflow: 'auto'}}>
        <Flex flexDirection="column">
          <NavItems items={navItems} />
        </Flex>
      </BorderBox>
    </Position>
  )
}

export default Sidebar
