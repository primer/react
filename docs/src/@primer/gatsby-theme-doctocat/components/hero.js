import {Box, Heading, Text, ThemeProvider} from '@primer/react'
import React from 'react'
import {Container} from '@primer/gatsby-theme-doctocat'
import heroIllustration from '../primer-components-hero.svg'
import packageJson from '../../../../../packages/react/package.json'

export default function Hero() {
  return (
    <ThemeProvider colorMode="night" nightScheme="dark_dimmed">
      <Box bg="canvas.default" py={6}>
        <Container>
          <Heading as="h2" sx={{color: 'accent.fg', fontSize: 7, lineHeight: 'condensed', pb: 3, m: 0}}>
            Primer React
          </Heading>
          <Text as="p" fontFamily="mono" mt={0} mb={2} color="fg.default" fontSize={2}>
            v{packageJson.version}
          </Text>
          <img src={heroIllustration} alt="" width="100%" />
        </Container>
      </Box>
    </ThemeProvider>
  )
}
