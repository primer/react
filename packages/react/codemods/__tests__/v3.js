import {defineInlineTest} from 'jscodeshift/dist/testUtils'
import v3 from '../v3'

defineInlineTest(
  v3,
  {},
  `
import {DonutChart, DonutSlice} from 'primer-react'
export default () => (
  <DonutChart>
    <DonutSlice />
  </DonutChart>
)
`.trim(),
  `
import {Donut} from '@primer/components'
export default () => (
  <Donut>
    <Donut.Slice />
  </Donut>
)
`.trim(),
  'v3',
)
