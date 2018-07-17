import React from 'react'
import {Block, Link} from '../../src'

const LinkExample = {
  name: 'Link',
  element: (
    <div>
      <Block mb={1}>
        <Link href="https://github.com">Link</Link>
      </Block>
      <Block mb={1}>
        <Link muted href="https://github.com">
          Link muted
        </Link>
      </Block>
      <Block mb={1}>
        <Link scheme="gray" href="https://github.com">
          Link gray
        </Link>
      </Block>
      <Block mb={1}>
        <Link scheme="gray-dark" href="https://github.com">
          Link gray-dark
        </Link>
      </Block>
    </div>
  )
}

export default LinkExample
