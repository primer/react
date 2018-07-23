import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Block, Dropdown} from '../../src'
import ExampleHeading from '../doc-components/ExampleHeading'

const dropdownPrimary =
`<Dropdown scheme={'primary'}>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</Dropdown>`

const dropdown =
`<Dropdown>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</Dropdown>`

const dropdownTitle =
`<Dropdown title="Options">
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</Dropdown>`


const DropdownExample = {
  name: 'Dropdown',
  element: (
    <div>
      <Block mb={4}>
        <ExampleHeading>Dropdown Primary</ExampleHeading>
        <LiveEditor code={dropdownPrimary} scope={{Dropdown}} />
      </Block>
      <Block my={4}>
        <ExampleHeading>Dropdown</ExampleHeading>
        <LiveEditor code={dropdown} scope={{Dropdown}} />
      </Block>
      <Block my={4}>
        <ExampleHeading>Dropdown with title</ExampleHeading>
        <LiveEditor code={dropdownTitle} scope={{Dropdown}}/>
      </Block>
    </div>
  )
}

export default DropdownExample
