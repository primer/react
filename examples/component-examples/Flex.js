import React from 'react'
import {PropsForm} from '@compositor/kit'
import {Block, FlexContainer, FlexItem} from '../../src'
import ExampleHeading from '../doc-components/ExampleHeading'

const propObj = {
  wrap: ['wrap', 'nowrap'],
  direction: ['row', 'row-reverse', 'column'],
  justifyContent: ['start', 'end', 'center', 'between', 'around'],
  alignItems: ['start', 'end', 'center', 'baseline', 'stretch'],
  alignContent: ['start', 'end', 'center', 'between', 'around', 'stretch']
}

const FlexExample = {
  name: 'Flex',
  element: (
    <Block p={2}>
      <ExampleHeading mt={2}>FlexContainer</ExampleHeading>
      <PropsForm>
        <FlexContainer
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
          <Block p={3} bg="blue">
            Item 1
          </Block>
          <Block p={3} bg="green">
            Item 2
          </Block>
          <Block p={3} bg="yellow">
            Item 3
          </Block>
          <Block p={3} bg="red">
            Item 4
          </Block>
          <Block p={3} bg="purple">
            Item 5
          </Block>
        </FlexContainer>
        {Object.keys(propObj).map(key => (
          <PropsForm.Select key={key} name={key}>
            {propObj[key].map(value => <option key={value}>{value}</option>)}
          </PropsForm.Select>
        ))}
      </PropsForm>
      <ExampleHeading mt={2}>FlexContainer + FlexItems set to flexAuto</ExampleHeading>
      <FlexContainer wrap="nowrap" width={300} height={300} border>
        <FlexItem flexAuto>
          <Block p={3} bg="blue">
            Item 1
          </Block>
        </FlexItem>
        <FlexItem flexAuto>
          <Block p={3} bg="green">
            Item 2
          </Block>
        </FlexItem>
        <FlexItem flexAuto>
          <Block p={3} bg="yellow">
            Item 3
          </Block>
        </FlexItem>
      </FlexContainer>
      <ExampleHeading mt={2}>FlexContainer + FlexItems with first item set to alignSelf='center'</ExampleHeading>
      <FlexContainer wrap="nowrap" width={300} height={300} border>
        <FlexItem alignSelf="center">
          <Block p={3} bg="blue">
            Item 1
          </Block>
        </FlexItem>
        <FlexItem>
          <Block p={3} bg="green">
            Item 2
          </Block>
        </FlexItem>
        <FlexItem>
          <Block p={3} bg="yellow">
            Item 3
          </Block>
        </FlexItem>
      </FlexContainer>
      <ExampleHeading mt={2}>FlexContainer + FlexItems using tag prop set to "p"</ExampleHeading>
      <FlexContainer wrap="nowrap" width={300} height={300} border>
        <FlexItem tag="p">
          <Block p={3} bg="blue">
            Item 1
          </Block>
        </FlexItem>
        <FlexItem tag="p">
          <Block p={3} bg="green">
            Item 2
          </Block>
        </FlexItem>
        <FlexItem tag="p">
          <Block p={3} bg="yellow">
            Item 3
          </Block>
        </FlexItem>
      </FlexContainer>
    </Block>
  )
}

export default FlexExample
