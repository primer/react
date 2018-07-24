import React from 'react'
import {Block, Dropdown} from '../../src'
import ExampleHeading from '../doc-components/ExampleHeading'

const DropdownExample = {
  name: 'Dropdown',
  element: (
    <div>
      <Block mb={4}>
        <ExampleHeading>Dropdown Primary</ExampleHeading>
        <Dropdown scheme={'primary'}>
          <span>Item 1</span>
          <span>Item 2</span>
          <span>Item 3</span>
        </Dropdown>
      </Block>
      <Block my={4}>
        <ExampleHeading>Dropdown</ExampleHeading>
        <Dropdown>
          <span>Item 1</span>
          <span>Item 2</span>
          <span>Item 3</span>
        </Dropdown>
      </Block>
      <Block my={4}>
        <ExampleHeading>Dropdown with title</ExampleHeading>
        <Dropdown title="Options">
          <span>Item 1</span>
          <span>Item 2</span>
          <span>Item 3</span>
        </Dropdown>
      </Block>
    </div>
  )
}

export default DropdownExample
