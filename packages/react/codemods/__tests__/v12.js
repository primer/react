import {defineInlineTest} from 'jscodeshift/dist/testUtils'
import v12 from '../v12'
defineInlineTest(
  v12,
  {},
  `
import {Box} from '@primer/components'
export default () => (
  <Box is="span">
    <Text>hi</Text>
  </Box>
)
`.trim(),
  `
import {Box} from '@primer/components'
export default () => (
  <Box as="span">
    <Text>hi</Text>
  </Box>
)
`.trim(),
  'v12',
)
