import React from 'react'
import {
  Provider as KitProvider,
  Library,
  Example
} from '@compositor/kit'
import Page from './Page'
import Box from './Box'
import Flex from './Flex'
import Heading from './Heading'
import Link from './Link'
import Button from './Button'
import theme from './theme'
import Text from './Text'

const Index = props => (

  <Page>
  <KitProvider>
    <Library>
      <Library.Nav />
      <Example name='Heading'>
        <Heading>
          Heading
        </Heading>
      </Example>
      <Example name='Link'>
        <Link href="https://github.com">
          Link
        </Link>
      </Example>
      <Example name='Box'>
        <Box p={3} bg='gray.1'> Box </Box>
      </Example>
      <Example name='Button'>
        <Button> Button </Button>
      </Example>
      <Example name='Typography'>
        <Text fontSize={7}>
        fontSize 7
        </Text>
        <Text fontSize={6}>
        fontSize 6
        </Text>
        <Text fontSize={5}>
          fontSize 5
        </Text>
        <Text fontSize={4}>
          fontSize 4
        </Text>
        <Text fontSize={3}>
        fontSize 3
        </Text>
        <Text fontSize={2}>
        fontSize 2
        </Text>
        <Text fontSize={1}>
        fontSize 1
        </Text>
        <Text fontSize={0}>
        fontSize 0
        </Text>
      </Example>
      <Example name='Text'>
        <Text>
          Text
        </Text>
        <Text fontWeight='bold'>
          Text bold
        </Text>
        <Text color='green.5'>
          Text green
        </Text>
        <Text lineHeight={1.25}>
          Text lineHeight 1.25
        </Text>
        <Text fontSize={4}>
          Text fontSize 4
        </Text>
        <Text p={4}>
          Text padding 4
        </Text>
      </Example>
    </Library>
  </KitProvider>
  </Page>
)
export default Index
