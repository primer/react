import React from 'react'
import {
  Provider as KitProvider,
  Library,
  Example
} from '@compositor/kit'
import Page from './Page'
import Box from './Box'
import ExampleBox from './ExampleBox'
import Flex from './Flex'
import Heading from './Heading'
import Link from './Link'
import Button from './Button'
import theme from './theme'
import Text from './Text'
import ButtonPrimary from './ButtonPrimary'
import ButtonSecondary from './ButtonSecondary'
import ButtonDanger from './ButtonDanger'
import Flash from './Flash'
import Octicon from '@github/octicons-react'
import StateLabel from './StateLabel'
import CounterLabel from './CounterLabel'

const Swatch = ({name, index, color, ...rest}) => (
  <div {...rest} key={index}>
    <Box mt={3} p={6} m={1} bg={`${name}.${index}`} />
    <Heading.h3 fontSize={2} px={1}>
      {name}.{index}
    </Heading.h3>
    <Text px={1}>
      {color}
    </Text>
  </div>
)

const Index = props => (
  <Page>
    <KitProvider>
      <Library>
        <Library.Nav />
        <Example name="CounterLabel">
          <CounterLabel>
            12
          </CounterLabel>
          <CounterLabel theme='gray'>
            13
          </CounterLabel>
          <CounterLabel theme='gray-light'>
            13
          </CounterLabel>
        </Example>
        <Example name='Heading'>
          <Heading mb={2}>Heading</Heading>
          <Heading.h1 fontSize={6} mb={2}>Heading (h1@6)</Heading.h1>
          <Heading.h2 fontSize={5} mb={2}>Heading (h2@5)</Heading.h2>
          <Heading.h3 fontSize={4} mb={2}>Heading (h3@4)</Heading.h3>
          <Heading.h4 fontSize={3} mb={2}>Heading (h4@3)</Heading.h4>
          <Heading.h5 fontSize={2} mb={2}>Heading (h5@2)</Heading.h5>
          <Heading.h6 fontSize={1} mb={2}>Heading (h6@1)</Heading.h6>
        </Example>
        <Example name='Link'>
          <Link href="https://github.com">
            Link
          </Link>
        </Example>
        <Example name='Box'>
          <Box p={3} bg='gray'>Box</Box>
        </Example>
        <Example name='Button'>
          <Button> Button </Button>
        </Example>
        <Example name='ButtonPrimary'>
          <ButtonPrimary>
            button primary
          </ButtonPrimary>
        </Example>
        <Example name='ButtonSecondary'>
          <ButtonSecondary>
            button secondary
          </ButtonSecondary>
        </Example>
        <Example name='ButtonDanger'>
          <ButtonDanger>
            button danger
          </ButtonDanger>
        </Example>
        <Example name='Button small'>
          <ButtonSecondary small>
            button small
          </ButtonSecondary>
        </Example>
        <Example name='Button large'>
          <ButtonSecondary large>
            button large
          </ButtonSecondary>
        </Example>
        <Example name='Flash themes'>
          <ExampleBox>
            <Flash>
              Flash
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
          </ExampleBox>
        </Example>
        <Example name='Flash full'>
          <Flash full>
            Flash full
          </Flash>
        </Example>
        <Example name='Font Sizes'>
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
          {['gray', 'blue', 'green', 'purple', 'yellow', 'orange'].map((hue, i) => (
            <Flex key={i}>
              {theme.colors[hue].map((color, j) => (
                <Swatch name={hue} index={j} color={color}/>
              ))}
            </Flex>
          ))}
        </Example>
        <Example name='StateLabel'>
          <Box mb={4}>
            <Heading.h2 mb={1}>By state (Octicons built in)</Heading.h2>
            <Box mb={2}>
              <StateLabel>Unknown</StateLabel>
            </Box>
            <Box mb={2}>
              <StateLabel state='open'>Opened</StateLabel>
            </Box>
            <Box mb={2}>
              <StateLabel state='closed'>Closed</StateLabel>
            </Box>
            <Box mb={2}>
              <StateLabel state='merged'>Merged</StateLabel>
            </Box>
            <Box mb={2}>
              <StateLabel state='reopened'>Reopened</StateLabel>
            </Box>
          </Box>
          <Box mb={4}>
            <Heading.h2 mb={1}>By color</Heading.h2>
            <Box mb={2}>
              <StateLabel bg='invalid'>Invalid</StateLabel>
            </Box>
            <Box mb={2}>
              <StateLabel bg='green'>Green</StateLabel>
            </Box>
            <Box mb={2}>
              <StateLabel bg='red'>Red</StateLabel>
            </Box>
            <Box mb={2}>
              <StateLabel bg='purple'>Purple</StateLabel>
            </Box>
          </Box>
          <Box mb={4}>
            <Heading.h2 mb={2}>Small, by state</Heading.h2>
            <Box mb={2}>
              <span className='mr-2'>
                <StateLabel small>Unknown</StateLabel>
              </span>
              <span className='mr-2'>
                <StateLabel small state='open'>Opened</StateLabel>
              </span>
              <span className='mr-2'>
                <StateLabel small state='closed'>Closed</StateLabel>
              </span>
              <span className='mr-2'>
                <StateLabel small state='merged'>Merged</StateLabel>
              </span>
              <span className='mr-2'>
                <StateLabel small state='reopened'>Reopened</StateLabel>
              </span>
            </Box>
          </Box>
          <Box mb={4}>
            <Heading.h2 mb={1}>Small, by color</Heading.h2>
            <Box mb={2}>
              <span className='mr-2'>
                <StateLabel small bg='invalid'>Invalid</StateLabel>
              </span>
              <span className='mr-2'>
                <StateLabel small bg='green'>Green</StateLabel>
              </span>
              <span className='mr-2'>
                <StateLabel small bg='red'>Red</StateLabel>
              </span>
              <span className='mr-2'>
                <StateLabel small bg='purple'>Purple</StateLabel>
              </span>
              <span className='mr-2'>
                <StateLabel small bg='green' icon={<Octicon name='git-branch'/>}>
                  Custom Octicon
                </StateLabel>
              </span>
            </Box>
          </Box>
        </Example>
      </Library>
    </KitProvider>
  </Page>
)
export default Index
