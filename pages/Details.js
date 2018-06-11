import React from 'react'
import {Block, Box, Details, Heading} from '../src'
import {ExampleHeading} from '../lib'

export default () => (
  <Block>
    <Block mb={4}>
      <ExampleHeading>With static children</ExampleHeading>
      <Details>
        <summary className='btn'>Click me</summary>
        <p>This should show and hide</p>
      </Details>
    </Block>
    <Block my={4}>
      <ExampleHeading>With children as a function</ExampleHeading>
      <Details>{({open, toggle}) => (
        <React.Fragment>
          <summary className='btn' onClick={toggle}>{open ? 'Hide' : 'Show'}</summary>
          <p>This should show and hide</p>
        </React.Fragment>
      )}
      </Details>
    </Block>
    <Block my={4}>
      <ExampleHeading>With render prop</ExampleHeading>
      <Details render={() => 'hi'}/>
    </Block>
  </Block>
)
