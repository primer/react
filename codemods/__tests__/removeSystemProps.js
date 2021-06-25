import {defineInlineTest} from 'jscodeshift/dist/testUtils'
import removeSystemProps from '../removeSystemProps'
defineInlineTest(
  removeSystemProps,
  {},
  `
import {Label} from '@primer/components'
export default () => (
  <Label mr={1}>
    <Text>hi</Text>
  </Label>
)
`.trim(),
  `
import {Label} from '@primer/components'
export default () => (
  <Label sx={{mr: 1}}>
    <Text>hi</Text>
  </Label>
)
`.trim(),
  'removeSystemProps'
)
