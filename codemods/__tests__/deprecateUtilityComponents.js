import {defineInlineTest} from 'jscodeshift/dist/testUtils'
import deprecateUtilityComponents from '../deprecateUtilityComponents'

defineInlineTest(
  deprecateUtilityComponents,
  {},
  `
import {Flex} from '@primer/components'
export default () => (
  <Flex>
    <div />
  </Flex>
)
`.trim(),
  `
import {Box} from '@primer/components'
export default () => (
  <Box display="flex">
    <div />
  </Box>
)
`.trim(),
  'deprecateUtilityComponents'
)
