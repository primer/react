import React from 'react'
import {Block, Dropdown, Heading} from '../src'
import {ExampleHeading} from '../lib'

export default () => (
  <Block p={4}>
    <Block mb={4}>
      <ExampleHeading>Dropdown Primary</ExampleHeading>
      <Dropdown scheme='primary'>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </Dropdown>
    </Block>
    <Block mb={4}>
      <ExampleHeading>Dropdown</ExampleHeading>
      <Dropdown>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </Dropdown>
    </Block>
    <Block mb={4}>
      <ExampleHeading>Dropdown with title</ExampleHeading>
      <Dropdown title='Options'>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </Dropdown>
    </Block>
  </Block>
)
