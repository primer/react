/* eslint-disable import/no-namespace */
import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {NavLink} from 'react-router-dom'
import * as components from '../src'

const {Box} = components

Object.assign(components, {NavLink})

const code = `
<Heading>Hello World!</Heading>
<Text is='p'>
  All of the primer-react <NavLink to='/components'>components</NavLink> are available in this sandbox!
</Text>
<BorderBox my={4} p={2}>
  This is a box with <Text fontFamily="mono">some mono text</Text>.
</BorderBox>
`.trim()

export default function Sandbox() {
  return (
    <Box px={3}>
      <LiveEditor code={code} scope={components} />
    </Box>
  )
}
