import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {BorderBox, Box} from '../../src'

const BorderBoxExample = {
  name: 'BorderBox',
  element: (
    <div>
      <Box mb={6}>
        <LiveEditor code={`<BorderBox>This is a BorderBox</BorderBox>`} scope={{BorderBox}} />
      </Box>
      <Box mb={6}>
        <LiveEditor code={`<BorderBox p={2}>This is a BorderBox with padding.</BorderBox>`} scope={{BorderBox}} />
      </Box>
      <Box mb={6}>
        <LiveEditor code={`<BorderBox boxShadow="small" m={4} p={2}>This is a BorderBox with shadow.</BorderBox>`} scope={{BorderBox}} />
      </Box>
      <Box mb={6}>
        <LiveEditor
          code={`<BorderBox boxShadow="medium" m={4} p={2}>This is a BorderBox with a medium shadow.</BorderBox>`}
          scope={{BorderBox}}
        />
      </Box>
      <Box mb={6}>
        <LiveEditor
          code={`<BorderBox boxShadow="large" m={4} p={2}>This is a BorderBox with a large shadow.</BorderBox>`}
          scope={{BorderBox}}
        />
      </Box>
      <Box mb={6}>
        <LiveEditor
          code={`<BorderBox boxShadow="extra-large" m={4} p={2}>This is a BorderBox with an extra-large shadow.</BorderBox>`}
          scope={{BorderBox}}
        />
      </Box>
      <Box mb={6}>
        <LiveEditor code={`<BorderBox borderColor="green.5" p={2}>This is a BorderBox with a green border.</BorderBox>`} scope={{BorderBox}} />
      </Box>
    </div>
  )
}

export default BorderBoxExample
