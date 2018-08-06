import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Block, Link} from '../../src'

const LinkExample = {
  name: 'Link',
  element: (
    <div>
      <Block mb={1}>
        <LiveEditor code={`<Link href="https://github.com">Link</Link>`} scope={{Link}} />
      </Block>
      <Block mb={1}>
        <LiveEditor code={`<Link muted href="https://github.com">Link muted</Link>`} scope={{Link}} />
      </Block>
      <Block mb={1}>
        <LiveEditor code={`<Link scheme="gray" href="https://github.com">Link gray</Link>`} scope={{Link}} />
      </Block>
      <Block mb={1}>
        <LiveEditor code={`<Link scheme="gray-dark" href="https://github.com">Link gray-dark</Link>`} scope={{Link}} />
      </Block>
    </div>
  )
}

export default LinkExample
