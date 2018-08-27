import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Box, Avatar} from '../../src'

export default {
  name: 'Avatar',
  element: (
    <div>
      <Box mb={2}>
        <LiveEditor
          code={`<Avatar src="https://avatars.githubusercontent.com/primer?v=3&s=128" size={128} username="primer" />`}
          scope={{Avatar}}
        />
      </Box>
      <Box mb={2}>
        <LiveEditor
          code={`<Avatar src="https://avatars.githubusercontent.com/primer?v=3&s=128" size={128} username="primer" />`}
          scope={{Avatar}}
        />
      </Box>
      <Box mb={2}>
        <LiveEditor
          code={`<Avatar src="https://avatars.githubusercontent.com/reactjs?v=3&s=32" size={32} username="reactjs" />`}
          scope={{Avatar}}
        />
      </Box>
      <Box>
        <LiveEditor
          code={`<Avatar src="https://avatars.githubusercontent.com/npm?v=3&s=64" username="npm" />`}
          scope={{Avatar}}
        />
      </Box>
    </div>
  )
}
