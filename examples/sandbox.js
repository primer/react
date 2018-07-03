import React from 'react'
import {LiveEditor} from '@compositor/kit'
import * as components from '../src'

const code = `
  <Block p={4}>
    <Heading>Hello World!</Heading>
    <Text>To get started with the Sandbox, start adding some primer-react components</Text>
  </Block>`

const Sandbox = () => <LiveEditor code={code} scope={components} />

export default Sandbox
