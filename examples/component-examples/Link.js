import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Box, Link} from '../../src'

export default {
  name: 'Link',
  element: (
    <div>
      <Box mb={1}>
        <LiveEditor code={`<Link href="https://github.com">Link</Link>`} scope={{Link}} />
      </Box>
      <Box mb={1}>
        <LiveEditor code={`<Link muted href="https://github.com">Link muted</Link>`} scope={{Link}} />
      </Box>
      <Box mb={1}>
        <LiveEditor code={`<Link scheme="gray" href="https://github.com">Link gray</Link>`} scope={{Link}} />
      </Box>
      <Box mb={1}>
        <LiveEditor code={`<Link scheme="gray-dark" href="https://github.com">Link gray-dark</Link>`} scope={{Link}} />
      </Box>
    </div>
  )
}
