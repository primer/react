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
  'deprecateUtilityComponents',
)

defineInlineTest(
  deprecateUtilityComponents,
  {},
  `
import {Grid} from '@primer/components'
export default () => (
  <Grid>
    <div />
  </Grid>
)
`.trim(),
  `
import {Box} from '@primer/components'
export default () => (
  <Box display="grid">
    <div />
  </Box>
)
`.trim(),
  'deprecateUtilityComponents',
)

defineInlineTest(
  deprecateUtilityComponents,
  {},
  `
import {Position} from '@primer/components'
export default () => (
  <Position>
    <div />
  </Position>
)
`.trim(),
  `
import {Box} from '@primer/components'
export default () => (
  <Box>
    <div />
  </Box>
)
`.trim(),
  'deprecateUtilityComponents',
)

defineInlineTest(
  deprecateUtilityComponents,
  {},
  `
import {Absolute} from '@primer/components'
export default () => (
  <Absolute>
    <div />
  </Absolute>
)
`.trim(),
  `
import {Box} from '@primer/components'
export default () => (
  <Box position="absolute">
    <div />
  </Box>
)
`.trim(),
  'deprecateUtilityComponents',
)

defineInlineTest(
  deprecateUtilityComponents,
  {},
  `
import {Relative} from '@primer/components'
export default () => (
  <Relative>
    <div />
  </Relative>
)
`.trim(),
  `
import {Box} from '@primer/components'
export default () => (
  <Box position="relative">
    <div />
  </Box>
)
`.trim(),
  'deprecateUtilityComponents',
)

defineInlineTest(
  deprecateUtilityComponents,
  {},
  `
import {Fixed} from '@primer/components'
export default () => (
  <Fixed>
    <div />
  </Fixed>
)
`.trim(),
  `
import {Box} from '@primer/components'
export default () => (
  <Box position="fixed">
    <div />
  </Box>
)
`.trim(),
  'deprecateUtilityComponents',
)

defineInlineTest(
  deprecateUtilityComponents,
  {},
  `
import {Sticky} from '@primer/components'
export default () => (
  <Sticky>
    <div />
  </Sticky>
)
`.trim(),
  `
import {Box} from '@primer/components'
export default () => (
  <Box position="sticky">
    <div />
  </Box>
)
`.trim(),
  'deprecateUtilityComponents',
)

defineInlineTest(
  deprecateUtilityComponents,
  {},
  `
import {BorderBox} from '@primer/components'
export default () => (
  <BorderBox borderColor="border.secondary" borderRadius={1}>
    <div />
  </BorderBox>
)
`.trim(),
  `
import {Box} from '@primer/components'
export default () => (
  <Box borderColor="border.secondary" borderRadius={1} borderWidth="1px" borderStyle="solid">
    <div />
  </Box>
)
`.trim(),
  'deprecateUtilityComponents',
)

defineInlineTest(
  deprecateUtilityComponents,
  {},
  `
import {Flex} from '@primer/components'
export default () => (
  <Flex p={2} m={1}>
    <div />
  </Flex>
)
`.trim(),
  `
import {Box} from '@primer/components'
export default () => (
  <Box p={2} m={1} display="flex">
    <div />
  </Box>
)
`.trim(),
  'deprecateUtilityComponents',
)
