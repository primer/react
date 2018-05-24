import React from 'react'
import {
  Library,
  Example,
  Detail
} from '@compositor/kit'
import {
  Page,
  ExampleBox,
  Box,
  Button,
  ButtonDanger,
  ButtonPrimary,
  ButtonSecondary,
  CounterLabel,
  Heading,
  Link,
  Text,
  Flash,
  StateLabel,
  theme
} from '../src'
import Octicon from '@github/octicons-react'

const Swatch = ({name, index, color, ...rest}) => (
  <div {...rest}>
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
    <Library title='Primer-react'>
      <Example name='Heading'>
        <Heading mb={2}>Heading</Heading>
        <Detail>
          <Heading.h1 fontSize={6} mb={2}>Heading (h1@6)</Heading.h1>
          <Heading.h2 fontSize={5} mb={2}>Heading (h2@5)</Heading.h2>
          <Heading.h3 fontSize={4} mb={2}>Heading (h3@4)</Heading.h3>
          <Heading.h4 fontSize={3} mb={2}>Heading (h4@3)</Heading.h4>
          <Heading.h5 fontSize={2} mb={2}>Heading (h5@2)</Heading.h5>
          <Heading.h6 fontSize={1} mb={2}>Heading (h6@1)</Heading.h6>
        </Detail>
      </Example>
      <Example name='Link'>
        <Link href="https://github.com">
          Link
        </Link>
      </Example>
      <Example name='Box'>
        <Box p={3} bg='gray.1'> Box </Box>
      </Example>
      <Example name='Box maxWidths'>
        <Box p={3} bg='gray.1' maxWidth='small'> Box small </Box>
        <Box p={3} bg='gray.2' maxWidth='medium'> Box medium </Box>
        <Box p={3} bg='gray.1' maxWidth='large'> Box large </Box>
        <Box p={3} bg='gray.2' maxWidth='xlarge'> Box xlarge </Box>
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
        <Detail>
          <Box my={2}>
            <ButtonPrimary large>
              button large
            </ButtonPrimary>
          </Box>
          <Box>
            <ButtonDanger large>
              button large
            </ButtonDanger>
          </Box>
        </Detail>
      </Example>
      <Example name="CounterLabel">
        <CounterLabel>
          12
        </CounterLabel>
        <CounterLabel theme={'gray'}>
          13
        </CounterLabel>
        <CounterLabel theme={'gray-light'}>
          13
        </CounterLabel>
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
        <div className='p-4 d-flex'>
          <Box bg='blue.5' p={6} m={1} />
          <Box bg='green.5' p={6} m={1} />
          <Box bg='purple.5' p={6} m={1} />
          <Box bg='yellow.5' p={6} m={1} />
          <Box bg='orange.5' p={6} m={1} />
          <Box bg='red.5' p={6} m={1} />
          <Box bg='black' p={6} m={1} />
          <Box bg='white' p={6} m={1} />
        </div>
        <Detail>
          {['gray', 'blue', 'green', 'purple', 'yellow', 'orange'].map((hue, i) => (
            <div className='d-flex' key={i}>
              {theme.colors[hue].map((color, j) => (
                <Swatch name={hue} index={j} key={j} color={color}/>
              ))}
            </div>
          ))}
        </Detail>
      </Example>
      <Example name='StateLabel'>
        <Box mb={2}>
          <StateLabel state='open'>Open</StateLabel>
        </Box>
        <Box mb={2}>
          <StateLabel state='closed'>Closed</StateLabel>
        </Box>
        <Box mb={4}>
          <StateLabel state='merged'>Merged</StateLabel>
        </Box>
        <Detail>
          <Box mb={4}>
            <Heading.h2 mb={1}>By state (Octicons built in)</Heading.h2>
            <Box mb={2}>
              <StateLabel>Unknown</StateLabel>
            </Box>
            <Box mb={2}>
              <StateLabel state='open'>Open</StateLabel>
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
                <StateLabel small state='open'>Open</StateLabel>
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
        </Detail>
      </Example>
    </Library>
  </Page>
)
export default Index
