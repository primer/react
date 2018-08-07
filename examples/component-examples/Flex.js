import React from 'react'
import {PropsForm, LiveEditor} from '@compositor/kit'
import {Block, FlexContainer, FlexItem} from '../../src'
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
    <Block p={3} bg="blue.5">
      Item 1
    </Block>
  </FlexItem>
  <FlexItem flexAuto>
    <Block p={3} bg="green.5">
      Item 2
    </Block>
  </FlexItem>
  <FlexItem flexAuto>
    <Block p={3} bg="yellow.5">
      Item 3
    </Block>
  </FlexItem>
</FlexContainer>`

const example2 = `<FlexContainer wrap="nowrap" width={300} height={300} border>
  <FlexItem alignSelf="center">
    <Block p={3} bg="blue.5">
      Item 1
    </Block>
  </FlexItem>
  <FlexItem>
    <Block p={3} bg="green.5">
      Item 2
    </Block>
  </FlexItem>
  <FlexItem>
    <Block p={3} bg="yellow.5">
      Item 3
    </Block>
  </FlexItem>
</FlexContainer>`

const example3 = `<FlexContainer wrap="nowrap" width={300} height={300} border>
  <FlexItem tag="p">
    <Block p={3} bg="blue.5">
      Item 1
    </Block>
  </FlexItem>
  <FlexItem tag="p">
    <Block p={3} bg="green.5">
      Item 2
    </Block>
  </FlexItem>
  <FlexItem tag="p">
    <Block p={3} bg="yellow.5">
      Item 3
    </Block>
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
          <Block p={3} bg="blue.5">
            Item 1
          </Block>
          <Block p={3} bg="green.5">
            Item 2
          </Block>
          <Block p={3} bg="yellow.5">
            Item 3
          </Block>
          <Block p={3} bg="red.5">
            Item 4
          </Block>
          <Block p={3} bg="purple.5">
            Item 5
          </Block>
        </FlexContainer>
        {Object.keys(propObj).map(key => (
          <PropsForm.Select key={key} name={key}>
            {propObj[key].map(value => <option key={value}>{value}</option>)}
          </PropsForm.Select>
        ))}
      </PropsForm>
      <ExampleHeading mt={3}>FlexContainer + FlexItems set to flexAuto</ExampleHeading>
      <LiveEditor code={example1} scope={{FlexContainer, FlexItem, Block}} />
      <ExampleHeading mt={2}>FlexContainer + FlexItems with first item set to alignSelf='center'</ExampleHeading>
      <LiveEditor code={example2} scope={{FlexContainer, FlexItem, Block}} />
      <ExampleHeading mt={2}>FlexContainer + FlexItems using tag prop set to "p"</ExampleHeading>
      <LiveEditor code={example3} scope={{FlexContainer, FlexItem, Block}} />
    </div>
  )
}

export default FlexExample
