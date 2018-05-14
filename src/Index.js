import React from 'react'
import {
  Provider as KitProvider,
  Library,
  Example
} from '@compositor/kit'
import Page from './Page'
import Box from './Box'
import ExampleBox from './ExampleBox'
import UtilityBox from './UtilityBox'
import Flex from './Flex'
import Heading, {H3} from './Heading'
import Link from './Link'
import Button from './Button'
import theme from './theme'
import Text from './Text'
import ButtonPrimary from './ButtonPrimary'
import ButtonSecondary from './ButtonSecondary'
import ButtonDanger from './ButtonDanger'
import Flash from './Flash'

const Swatch = ({name, index, color, ...rest}) => (
  <div {...rest} key={index}>
    <Box mt={3} p={6} m={1} bg={`${name}.${index}`} />
    <H3 fontSize={2} px={1}>
      {name}.{index}
    </H3>
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
        <Example name='Box maxWidths'>
          <Box p={3} bg='gray.1' maxWidth='small'> Box small </Box>
          <Box p={3} bg='gray.2' maxWidth='medium'> Box medium </Box>
          <Box p={3} bg='gray.1' maxWidth='large'> Box large </Box>
          <Box p={3} bg='gray.2' maxWidth='xlarge'> Box xlarge </Box>
        </Example>
        <Example name='UtilityBox'>
          <UtilityBox bg='green-light' my={4} p={4}>
            UtilityBox with Primer utilities as props
          </UtilityBox>
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
      </Library>
    </KitProvider>
  </Page>
)
export default Index
