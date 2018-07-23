/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Block, Details} from '../../src'
import ExampleHeading from '../doc-components/ExampleHeading'

const example1 = `<Details>
  <summary className="btn">Click me</summary>
  <p>This should show and hide</p>
</Details>
`

const example2 = `<Details>
  {({open, toggle}) => (
    <React.Fragment>
      <summary className="btn" onClick={toggle}>
        {open ? 'Hide' : 'Show'}
      </summary>
      <p>This should show and hide</p>
    </React.Fragment>
  )}
</Details>
`

const DetailsExample = {
  name: 'Details',
  element: (
    <div>
      <Block mb={4}>
        <ExampleHeading>With static children</ExampleHeading>
        <LiveEditor code={example1} scope={{Details}} />
      </Block>
      <Block my={4}>
        <ExampleHeading>With children as a function</ExampleHeading>
        <LiveEditor code={example2} scope={{Details}} />
      </Block>
      <Block my={4}>
        <ExampleHeading>With render prop</ExampleHeading>
        <LiveEditor code={`<Details render={() => 'hi'} />`} scope={{Details}} />
      </Block>
    </div>
  )
}

export default DetailsExample
