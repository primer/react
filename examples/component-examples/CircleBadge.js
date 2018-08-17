import React from 'react'
import Octicon, {Zap} from '@githubprimer/octicons-react'
import {LiveEditor} from '@compositor/kit'
import {Box, CircleBadge, Heading} from '../../src'

const octicon = `<CircleBadge size="medium">
  <Octicon icon={Zap}/>
</CircleBadge>`

const image = `<CircleBadge bg="blue.5" size="small"><img src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/></CircleBadge>`
const customSize = `<CircleBadge bg="blue.5" size={40}><img src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/></CircleBadge>`
const sizes = `<CircleBadge bg="blue.5" size="small"><img src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/></CircleBadge>
<CircleBadge bg="blue.5" size="medium"><img src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/></CircleBadge>
<CircleBadge bg="blue.5" size="large"><img src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/></CircleBadge>`

const CircleBadgeExample = {
  name: 'CircleBadge',
  element: (
    <div>
      <Box mb={2} pt={2}>
        <Heading fontSize={3}>Small, medium & large</Heading>
        <LiveEditor code={sizes} scope={{CircleBadge, Octicon, Zap}} />
      </Box>
      <Box mb={2} pt={2}>
        <Heading fontSize={3}>With custom width & height</Heading>
        <LiveEditor code={customSize} scope={{CircleBadge, Octicon, Zap}} />
      </Box>
      <Box mb={2}>
        <Heading fontSize={3}>With Octicon as child</Heading>
        <LiveEditor code={octicon} scope={{CircleBadge, Octicon, Zap}} />
      </Box>
      <Box mb={2} pt={2}>
        <Heading fontSize={3}>{`With <img> as a child & bg prop`}</Heading>
        <LiveEditor code={image} scope={{CircleBadge, Octicon, Zap}} />
      </Box>
    </div>
  )
}

export default CircleBadgeExample
