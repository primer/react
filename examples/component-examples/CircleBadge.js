import React from 'react'
import Octicon, {Zap} from '@github/octicons-react'
import {LiveEditor} from '@compositor/kit'
import {Block, CircleBadge, Heading} from '../../src'

const octicon = `<CircleBadge size="medium">
  <Octicon icon={Zap}/>
</CircleBadge>`

const image = `<CircleBadge bg="blue" src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/>
`

const sizes = `<CircleBadge bg="blue" size="small" src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/>
<CircleBadge bg="blue" size="medium" src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/>
<CircleBadge bg="blue" size="large" src="https://avatars0.githubusercontent.com/t/1929972?s=280&v=4"/>`

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
        <Heading fontSize={3}>With src provided & bg prop</Heading>
        <LiveEditor code={image} scope={{CircleBadge, Octicon, Zap}} />
      </Block>
    </div>
  )
}

export default CircleBadgeExample
