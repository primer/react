import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Block, Dropdown, Link} from '../../src'
import ExampleHeading from '../doc-components/ExampleHeading'

const dropdownPrimary = `<Dropdown scheme="primary" minWidth="5em">
  <ul className="list-style-none m-0 p-0">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</Dropdown>`

const dropdown = `<Dropdown minWidth="5em">
  <ul className="list-style-none m-0 p-0">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</Dropdown>`

const dropdownTitle = `<Dropdown title="Options" minWidth="5em">
  <ul className="list-style-none m-0 p-0">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</Dropdown>`

const scope = {Block, Dropdown, Link}

const DropdownExample = {
  name: 'Dropdown',
  element: (
    <div>
      <Block mb={4}>
        <ExampleHeading>Dropdown Primary</ExampleHeading>
        <LiveEditor code={dropdownPrimary} scope={scope} />
      </Block>
      <Block my={4}>
        <ExampleHeading>Dropdown</ExampleHeading>
        <LiveEditor code={dropdown} scope={scope} />
      </Block>
      <Block my={4}>
        <ExampleHeading>Dropdown with title</ExampleHeading>
        <LiveEditor code={dropdownTitle} scope={scope} />
      </Block>
    </div>
  )
}

export default DropdownExample
