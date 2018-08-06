import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Block, DonutChart, Text, DonutSlice, theme} from '../../src'
import ExampleHeading from '../doc-components/ExampleHeading'

const dataPropExample = `<DonutChart mr={1} data={{error: 2, pending: 3, success: 5}} />
<DonutChart mr={1} data={{error: 1, pending: 4, success: 2}} />
<DonutChart mr={1} data={{pending: 2, success: 6}} />
<DonutChart mr={1} data={{pending: 0, success: 1}} />
<DonutChart mr={1} data={{pending: 1, queued: 1}} />
<DonutChart mr={1} data={{unknown: 1}} />`

const donutSliceExample = `<DonutChart mr={1}>
  <DonutSlice value={1} state="pending" />
  <DonutSlice value={1} state="success" />
  <DonutSlice value={1} state="error" />
</DonutChart>

<DonutChart mr={1}>
  <DonutSlice value={1} state="error" />
  <DonutSlice value={4} state="pending" />
  <DonutSlice value={2} state="success" />
</DonutChart>

<DonutChart mr={1}>
  <DonutSlice value={2} state="pending" />
  <DonutSlice value={6} state="success" />
</DonutChart>

<DonutChart mr={1}>
  <DonutSlice value={0} state="pending" />
  <DonutSlice value={1} state="success" />
</DonutChart>

<DonutChart mr={1}>
  <DonutSlice value={1} state="pending" />
  <DonutSlice value={1} state="queued" />
</DonutChart>

<DonutChart>
  <DonutSlice value={1} state="queued" />
</DonutChart>`

const customColorsExample = `<DonutChart>
  <DonutSlice value={1} fill={theme.colors.purple[0]} />
  <DonutSlice value={1} fill={theme.colors.purple[1]} />
  <DonutSlice value={1} fill={theme.colors.purple[2]} />
  <DonutSlice value={1} fill={theme.colors.purple[3]} />
  <DonutSlice value={1} fill={theme.colors.purple[4]} />
</DonutChart>`

const DonutChartExample = {
  name: 'DonutChart',
  element: (
    <div>
      <Block mb={2}>
        <ExampleHeading>
          With <Text fontFamily="mono">data</Text> prop
        </ExampleHeading>
        <LiveEditor code={dataPropExample} scope={{DonutChart}} />
      </Block>
      <Block mb={2}>
        <ExampleHeading>
          With <Text fontFamily="mono">DonutSlice</Text> children
        </ExampleHeading>
        <LiveEditor code={donutSliceExample} scope={{DonutChart, DonutSlice}} />
      </Block>
      <Block mb={2}>
        <ExampleHeading>
          With custom <Text fontFamily="mono">fill</Text> colors
        </ExampleHeading>
        <LiveEditor code={customColorsExample} scope={{DonutSlice, DonutChart, theme}} />
      </Block>
    </div>
  )
}

export default DonutChartExample
