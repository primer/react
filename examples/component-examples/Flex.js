import React from 'react'
import {PropsForm, LiveEditor} from '@compositor/kit'
import {Box, FlexContainer, FlexItem} from '../../src'
import ExampleHeading from '../doc-components/ExampleHeading'

const propObj = {
  wrap: ['wrap', 'nowrap'],
  direction: ['row', 'row-reverse', 'column'],
  justifyContent: ['start', 'end', 'center', 'between', 'around'],
  alignItems: ['start', 'end', 'center', 'baseline', 'stretch'],
  alignContent: ['start', 'end', 'center', 'between', 'around', 'stretch']
}

const example1 = `<FlexContainer wrap="nowrap" width={300} height={300} border>
  <FlexItem flexAuto>
    <Box p={3} bg="blue.5">
      Item 1
    </Box>
  </FlexItem>
  <FlexItem flexAuto>
    <Box p={3} bg="green.5">
      Item 2
    </Box>
  </FlexItem>
  <FlexItem flexAuto>
    <Box p={3} bg="yellow.5">
      Item 3
    </Box>
  </FlexItem>
</FlexContainer>`

const example2 = `<FlexContainer wrap="nowrap" width={300} height={300} border>
  <FlexItem alignSelf="center">
    <Box p={3} bg="blue.5">
      Item 1
    </Box>
  </FlexItem>
  <FlexItem>
    <Box p={3} bg="green.5">
      Item 2
    </Box>
  </FlexItem>
  <FlexItem>
    <Box p={3} bg="yellow.5">
      Item 3
    </Box>
  </FlexItem>
</FlexContainer>`

const example3 = `<FlexContainer wrap="nowrap" width={300} height={300} border>
  <FlexItem is="p">
    <Box p={3} bg="blue.5">
      Item 1
    </Box>
  </FlexItem>
  <FlexItem is="p">
    <Box p={3} bg="green.5">
      Item 2
    </Box>
  </FlexItem>
  <FlexItem is="p">
    <Box p={3} bg="yellow.5">
      Item 3
    </Box>
  </FlexItem>
</FlexContainer>
`
const FlexExample = {
  name: 'Flex',
  element: (
    <div>
      <ExampleHeading>FlexContainer</ExampleHeading>
      <PropsForm>
        <FlexContainer
          display="flex"
          wrap="wrap"
          direction="row"
          justifyContent="start"
          alignItems="start"
          alignContent="start"
          flexAuto
          alignSelf="start"
          width={300}
          height={300}
          border
        >
          <Box p={3} bg="blue.5">
            Item 1
          </Box>
          <Box p={3} bg="green.5">
            Item 2
          </Box>
          <Box p={3} bg="yellow.5">
            Item 3
          </Box>
          <Box p={3} bg="red.5">
            Item 4
          </Box>
          <Box p={3} bg="purple.5">
            Item 5
          </Box>
        </FlexContainer>
        {Object.keys(propObj).map(key => (
          <PropsForm.Select key={key} name={key}>
            {propObj[key].map(value => <option key={value}>{value}</option>)}
          </PropsForm.Select>
        ))}
      </PropsForm>
      <ExampleHeading mt={3}>FlexContainer + FlexItems set to flexAuto</ExampleHeading>
      <LiveEditor code={example1} scope={{FlexContainer, FlexItem, Box}} />
      <ExampleHeading mt={2}>FlexContainer + FlexItems with first item set to alignSelf='center'</ExampleHeading>
      <LiveEditor code={example2} scope={{FlexContainer, FlexItem, Box}} />
      <ExampleHeading mt={2}>FlexContainer + FlexItems using tag prop set to "p"</ExampleHeading>
      <LiveEditor code={example3} scope={{FlexContainer, FlexItem, Box}} />
    </div>
  )
}

export default FlexExample
