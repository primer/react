import {defineInlineTest} from 'jscodeshift/dist/testUtils'
import v2 from '../v2'

defineInlineTest(
  v2,
  {},
  `
import {Block, Box} from 'primer-react'
export default () => (
  <Block>
    <Box />
  </Block>
)
`.trim(),
  `
import {Box, BorderBox} from 'primer-react'
export default () => (
  <Box>
    <BorderBox />
  </Box>
)
`.trim(),
  'v2',
)
