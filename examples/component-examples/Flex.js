import React from 'react'
import {PropsForm, LiveEditor} from '@compositor/kit'
import {BorderBox, Box, FlexContainer, FlexItem} from '../../src'
import {ExampleHeading} from '../doc-components'

const propObj = {
  flexWrap: ['wrap', 'nowrap'],
  flexDirection: ['row', 'row-reverse', 'column'],
  justifyContent: ['start', 'end', 'center', 'between', 'around'],
  alignItems: ['start', 'end', 'center', 'baseline', 'stretch'],
  alignContent: ['start', 'end', 'center', 'between', 'around', 'stretch']
}

const scope = {Box, BorderBox, FlexContainer, FlexItem}

const example1 = `
<BorderBox width={300} height={300} borderRadius={0}>
  <FlexContainer flexWrap="nowrap">
    <FlexItem>
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
  </FlexContainer>
</BorderBox>
`.trim()

const example2 = `
<BorderBox width={400} height={200} borderRadius={0}>
  <FlexContainer flexWrap="nowrap">
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
  </FlexContainer>
</BorderBox>
`.trim()

const example3 = `
<BorderBox width={400} height={200} borderRadius={0}>
  <FlexContainer flexWrap="nowrap">
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
</BorderBox>
`.trim()

const FlexExample = {
  name: 'Flex',
  element: (() => {
    const defaultProps = Object.keys(propObj).reduce((props, key) => {
      props[key] = propObj[key][0]
      return props
    }, {})

    return (
      <div>
        <ExampleHeading>FlexContainer</ExampleHeading>
        <PropsForm>
          <FlexContainer is={BorderBox} width={400} height={200} {...defaultProps}>
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
        <ExampleHeading mt={3}>FlexContainer + FlexItems</ExampleHeading>
        <LiveEditor code={example1} scope={scope} />
        <ExampleHeading mt={2}>FlexContainer + FlexItems with first item set to alignSelf='center'</ExampleHeading>
        <LiveEditor code={example2} scope={scope} />
        <ExampleHeading mt={2}>FlexContainer + FlexItems using tag prop set to "p"</ExampleHeading>
        <LiveEditor code={example3} scope={scope} />
      </div>
    )
  })()
}

export default FlexExample
