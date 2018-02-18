import React from 'react'
import Page from './Page'
import Box from './Box'
import Heading from './Heading'
import Link from './Link'

const Index = props => (

  <Page>
    <Box p={3} mx='auto' width={2/3}>
    <Heading>
      Primer React
    </Heading>
      <Box my={3}>
        <Link fontWeight='bold' href="https://github.com">
          Bold Link
        </Link>
      </Box>
    </Box>
  </Page>
)
export default Index
