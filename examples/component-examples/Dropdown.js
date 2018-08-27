import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Box, Dropdown, Link} from '../../src'
import {ExampleHeading} from '../doc-components'

const dropdownPrimary = `<Dropdown scheme="primary" minWidth="5em">
  <Box is="ul" m={0} p={0} className="list-style-none">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </Box>
</Dropdown>`

const dropdown = `<Dropdown minWidth="5em">
  <Box is="ul" m={0} p={0} className="list-style-none">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </Box>
</Dropdown>`

const dropdownTitle = `<Dropdown title="Options" minWidth="5em">
  <Box is="ul" m={0} p={0} className="list-style-none">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </Box>
</Dropdown>`

const scope = {Box, Dropdown, Link}

export default {
  name: 'Dropdown',
  element: (
    <div>
      <Box mb={4}>
        <ExampleHeading>Dropdown Primary</ExampleHeading>
        <LiveEditor code={dropdownPrimary} scope={scope} />
      </Box>
      <Box my={4}>
        <ExampleHeading>Dropdown</ExampleHeading>
        <LiveEditor code={dropdown} scope={scope} />
      </Box>
      <Box my={4}>
        <ExampleHeading>Dropdown with title</ExampleHeading>
        <LiveEditor code={dropdownTitle} scope={scope} />
      </Box>
    </div>
  )
}
