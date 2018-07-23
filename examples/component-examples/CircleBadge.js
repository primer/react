import React from 'react'
import Octicon, {Zap} from '@githubprimer/octicons-react'
import {LiveEditor} from '@compositor/kit'
import {Block, CircleBadge, Heading} from '../../src'

const octicon =
`<CircleBadge size="medium">
  <Octicon icon={Zap}/>
</CircleBadge>`

const image =
`<CircleBadge bg="blue" size="small"><img src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/></CircleBadge>`

const sizes =
`<CircleBadge bg="blue" size="small"><img src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/></CircleBadge>
<CircleBadge bg="blue" size="medium"><img src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/></CircleBadge>
<CircleBadge bg="blue" size="large"><img src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/></CircleBadge>`

const CircleBadgeExample = {
  name: 'CircleBadge',
  element: (
    <div>
      <Block mb={2} pt={2}>
        <Heading fontSize={3}>Small, medium & large</Heading>
        <LiveEditor code={sizes} scope={{CircleBadge, Octicon, Zap}} />
      </Block>
      <Block mb={2}>
        <Heading fontSize={3}>With Octicon as child</Heading>
        <LiveEditor code={octicon} scope={{CircleBadge, Octicon, Zap}} />
      </Block>
      <Block mb={2} pt={2}>
        <Heading fontSize={3}>{`With <img> as a child & bg prop`}</Heading>
        <LiveEditor code={image} scope={{CircleBadge, Octicon, Zap}} />
      </Block>
    </div>
  )
}

export default CircleBadgeExample
