import loadable from '@loadable/component'
import {Box, Heading, Text} from '../../../../../src'
import React from 'react'
import {Container} from '@primer/gatsby-theme-doctocat'
import heroIllustration from '../primer-components-hero.svg'
import {version} from '../../../../../package.json'

const HeroAnimation = loadable(() => import('../PrimerComponentsAnimation'), {
  fallback: <img src={heroIllustration} alt="" width="100%" />
})

export default function Hero() {
  return (
    <Box bg="black" py={6}>
      <Container>
        <Heading color="blue.4" fontSize={7} lineHeight="condensed" pb={3} m={0}>
          Primer Components
        </Heading>
        <Text as="p" fontFamily="mono" mt={0} mb={2} color="blue.3" fontSize={2}>
          v{version}
        </Text>
        <HeroAnimation />
      </Container>
    </Box>
  )
}
