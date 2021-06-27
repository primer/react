import {defineInlineTest} from 'jscodeshift/dist/testUtils'
import removeSystemProps from '../removeSystemProps'
defineInlineTest(
  removeSystemProps,
  {},
  `
import {Label} from '@primer/components'
const leftMargin = 2
export default () => (
  <Label mr={1} ml={leftMargin}>
    <Text>hi</Text>
  </Label>
)
`.trim(),
  `
import {Label} from '@primer/components'
const leftMargin = 2
export default () => (
  <Label sx={{mr: 1, ml: leftMargin}}>
    <Text>hi</Text>
  </Label>
)
`.trim(),
  'removeSystemProps'
)
