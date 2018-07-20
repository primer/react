import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Block, Avatar} from '../../src'

const AvatarExample = {
  name: 'Avatar',
  element: (
    <div>
      <Block mb={2}>
        <LiveEditor code={`<Avatar src="https://avatars.githubusercontent.com/primer?v=3&s=128" size={128} username="primer" />`} scope={{Avatar}} />
      </Block>
      <Block mb={2}>
        <LiveEditor code={`<Avatar src="https://avatars.githubusercontent.com/primer?v=3&s=128" size={128} username="primer" />`} scope={{Avatar}} />
      </Block>
      <Block mb={2}>
        <LiveEditor code={`<Avatar src="https://avatars.githubusercontent.com/reactjs?v=3&s=32" size={32} username="reactjs" />`} scope={{Avatar}}/>
      </Block>
      <Block>
        <LiveEditor code={`<Avatar src="https://avatars.githubusercontent.com/npm?v=3&s=64" username="npm" />`} scope={{Avatar}}/>
      </Block>
    </div>
  )
}

export default AvatarExample
