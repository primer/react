import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Box, Flash} from '../../src'

export default {
  name: 'Flash',
  element: (
    <div>
      <Box mb={3}>
        <LiveEditor code={`<Flash> Flash </Flash>`} scope={{Flash}} />
      </Box>
      <Box mb={3}>
        <LiveEditor code={`<Flash scheme="yellow"> Flash yellow </Flash>`} scope={{Flash}} />
      </Box>
      <Box mb={3}>
        <LiveEditor code={`<Flash scheme="red"> Flash red </Flash>`} scope={{Flash}} />
      </Box>
      <Box mb={3}>
        <LiveEditor code={`<Flash scheme="green"> Flash green </Flash>`} scope={{Flash}} />
      </Box>
      <Box mb={3}>
        <LiveEditor code={`<Flash full> Flash full </Flash>`} scope={{Flash}} />
      </Box>
    </div>
  )
}
