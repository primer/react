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
        <Example name='Button'>
          {ButtonTemplate(Button, 'button')}
        </Example>
        <Example name='ButtonPrimary'>
          {ButtonTemplate(ButtonPrimary, 'primary button')}
        </Example>
        <Example name='ButtonSecondary'>
          {ButtonTemplate(ButtonSecondary, 'secondary button')}
        </Example>
        <Example name='ButtonDanger'>
          {ButtonTemplate(ButtonDanger, 'danger')}
        </Example>
        <Example name='Button small'>
          {ButtonTemplate(props => <Button size='small' {...props}>{props.children}</Button>, 'small')}
        </Example>
        <Example name='Button large'>
          {ButtonTemplate(props => <Button size='large' {...props}>{props.children}</Button>, 'large')}
        </Example>
        <Example name='Link button'>
          {ButtonTemplate(Button.a, 'link', false)}
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
          <Text fontSize={7}>fontSize 7</Text>
          <Text fontSize={6}>fontSize 6</Text>
          <Text fontSize={5}>fontSize 5</Text>
          <Text fontSize={4}>fontSize 4</Text>
          <Text fontSize={3}>fontSize 3</Text>
          <Text fontSize={2}>fontSize 2</Text>
          <Text fontSize={1}>fontSize 1</Text>
          <Text fontSize={0}>fontSize 0</Text>
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
          <Flex>{colorSwatches('gray')}</Flex>
          <Flex>{colorSwatches('blue')}</Flex>
          <Flex>{colorSwatches('green')}</Flex>
          <Flex>{colorSwatches('purple')}</Flex>
          <Flex>{colorSwatches('yellow')}</Flex>
          <Flex>{colorSwatches('orange')}</Flex>
          <Flex>{colorSwatches('red')}</Flex>
        </Example>
      </Library>
    </KitProvider>
  </Page>
)

const ButtonTemplate = (ButtonClass, label, disabled=true) => (
  <React.Fragment>
    <Box mb={2}><ButtonClass>{label}</ButtonClass></Box>
    <Box mb={2}><ButtonClass className='hover'>{label} :hover</ButtonClass></Box>
    <Box mb={2}><ButtonClass className='focus'>{label} :focus</ButtonClass></Box>
    <Box mb={2}><ButtonClass className='selected'>{label} :active</ButtonClass></Box>
    {disabled ? <Box><ButtonClass disabled>{label} :disabled</ButtonClass></Box> : ''}
  </React.Fragment>
)

const colorSwatches = (name) => (
  theme.colors[name].map((val, i) => (
    <div key={val}>
      <Box mt={3} p={6} m={1} bg={`${name}.${i}`} />
      <Heading.h3 fontSize={2} px={1}>
        {name} {i}
      </Heading.h3>
      <Text px={1}>
        {val}
      </Text>
    </div>
  ))
)

export default Index
