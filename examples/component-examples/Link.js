import React from 'react'
import { Block, Link } from '../../src'

const LinkExample =
  {
    name: 'Link',
    element: (
      <div>
        <Block mb={1}>
          <Link href='https://github.com'>Link</Link>
        </Block>
        <Block mb={1}>
          <Link muted href='https://github.com'>Link muted</Link>
        </Block>
        <Block mb={1}>
          <Link gray href='https://github.com'>Link gray</Link>
        </Block>
        <Block mb={1}>
          <Link graydark href='https://github.com'>Link graydark</Link>
        </Block>
      </div>
    )
  }

export default LinkExample
