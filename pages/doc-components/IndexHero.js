import React from 'react'
import {Box, Heading, Text} from '../../src'
import IndexImage from './IndexImage'

const IndexHero = () => (

  <Box bg="black">
    <Box maxWidth={1012} py={6} mb={4} mx={'auto'} px={6}>
      <Box mt={4} mb={6}>
        <Heading color="blue.4" fontSize={7} pb={3}>Primer Components</Heading>
        <Text color="blue.2" fontSize={2} fontWeight={400} className="text-mono">v2.0.4-beta</Text>
      </Box>
      <Box mb={6} mx={-4}>
        <IndexImage />
      </Box>
    </Box>
  </Box>


)

export default IndexHero
