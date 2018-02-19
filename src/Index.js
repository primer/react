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
import ButtonPrimary from './ButtonPrimary'
import Flash from './Flash'

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
      <Example name='ButtonPrimary'>
        <Box mb={4} mr={4}>
          <ButtonPrimary>
            button primary
          </ButtonPrimary>
        </Box>
        <Box mb={4} mr={4}>
          <ButtonPrimary large className='py-2'>
            large py-2
          </ButtonPrimary>
        </Box>
        <Box mb={4} mr={4}>
          <ButtonPrimary small>
            small
          </ButtonPrimary>
        </Box>
      </Example>
      <Example name='Flash'>
        <Flash>
          Flash message
        </Flash>
        <Flash yellow>
          Flash yellow
        </Flash>
        <Flash red>
          Flash red
        </Flash>
        <Flash green>
          Flash green
        </Flash>
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
      <Example name='Colors'>
        <Flex>
          {theme.colors.gray.map((val, i) => (
            <div key={val}>
              <Box mt={3} p={6} m={1} bg={`gray.${i}`} />
              <Heading.h3 fontSize={2} px={1}>
              gray {i}
              </Heading.h3>
              <Text px={1}>
                {val}
              </Text>
            </div>
          ))}
        </Flex>
        <Flex>
          {theme.colors.blue.map((val, i) => (
            <div key={val}>
              <Box mt={3} p={6} m={1} bg={`blue.${i}`} />
              <Heading.h3 fontSize={2} px={1}>
              blue {i}
              </Heading.h3>
              <Text px={1}>
                {val}
              </Text>
            </div>
          ))}
        </Flex>
        <Flex>
          {theme.colors.green.map((val, i) => (
            <div key={val}>
              <Box mt={3} p={6} m={1} bg={`green.${i}`} />
              <Heading.h3 fontSize={2} px={1}>
              green {i}
              </Heading.h3>
              <Text px={1}>
                {val}
              </Text>
            </div>
          ))}
        </Flex>
        <Flex>
          {theme.colors.purple.map((val, i) => (
            <div key={val}>
              <Box mt={3} p={6} m={1} bg={`purple.${i}`} />
              <Heading.h3 fontSize={2} px={1}>
              purple {i}
              </Heading.h3>
              <Text px={1}>
                {val}
              </Text>
            </div>
          ))}
        </Flex>
        <Flex>
          {theme.colors.yellow.map((val, i) => (
            <div key={val}>
              <Box mt={3} p={6} m={1} bg={`yellow.${i}`} />
              <Heading.h3 fontSize={2} px={1}>
              yellow {i}
              </Heading.h3>
              <Text px={1}>
                {val}
              </Text>
            </div>
          ))}
        </Flex>
        <Flex>
          {theme.colors.orange.map((val, i) => (
            <div key={val}>
              <Box mt={3} p={6} m={1} bg={`orange.${i}`} />
              <Heading.h3 fontSize={2} px={1}>
              orange {i}
              </Heading.h3>
              <Text px={1}>
                {val}
              </Text>
            </div>
          ))}
        </Flex>
        <Flex>
          {theme.colors.red.map((val, i) => (
            <div key={val}>
              <Box mt={3} p={6} m={1} bg={`red.${i}`} />
              <Heading.h3 fontSize={2} px={1}>
              red {i}
              </Heading.h3>
              <Text px={1}>
                {val}
              </Text>
            </div>
          ))}
        </Flex>
      </Example>
    </Library>
  </KitProvider>
  </Page>
)
export default Index
