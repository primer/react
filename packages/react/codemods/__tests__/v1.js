import {defineInlineTest} from 'jscodeshift/dist/testUtils'
import v1 from '../v1'
defineInlineTest(
  v1,
  {},
  `
import {Box} from 'primer-react'
export default () => (
  <Box tag="span">
    <Text fg="green">hi</Text>
  </Box>
)
`.trim(),
  `
import {Box} from 'primer-react'
export default () => (
  <Box is="span">
    <Text color="green">hi</Text>
  </Box>
)
`.trim(),
  'v1',
)
