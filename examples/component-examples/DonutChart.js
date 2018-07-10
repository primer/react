import React from 'react'
import {Block, DonutChart, Text, DonutSlice, theme} from '../../src'
import ExampleHeading from '../doc-components/ExampleHeading'

const DonutChartExample = {
  name: 'DonutChart',
  element: (
    <div>
      <Block mb={2}>
        <ExampleHeading>
          With <Text mono>data</Text> prop
        </ExampleHeading>
        <DonutChart data={{error: 2, pending: 3, success: 5}} />{' '}
        <DonutChart data={{error: 1, pending: 4, success: 2}} /> <DonutChart data={{pending: 2, success: 6}} />{' '}
        <DonutChart data={{pending: 0, success: 1}} /> <DonutChart data={{pending: 1, queued: 1}} />{' '}
        <DonutChart data={{unknown: 1}} />
      </Block>
      <Block mb={2}>
        <ExampleHeading>
          With <Text mono>DonutSlice</Text> children
        </ExampleHeading>
        <DonutChart>
          <DonutSlice value={1} state="pending" />
          <DonutSlice value={1} state="success" />
          <DonutSlice value={1} state="error" />
        </DonutChart>{' '}
        <DonutChart>
          <DonutSlice value={1} state="error" />
          <DonutSlice value={4} state="pending" />
          <DonutSlice value={2} state="success" />
        </DonutChart>{' '}
        <DonutChart>
          <DonutSlice value={2} state="pending" />
          <DonutSlice value={6} state="success" />
        </DonutChart>{' '}
        <DonutChart>
          <DonutSlice value={0} state="pending" />
          <DonutSlice value={1} state="success" />
        </DonutChart>{' '}
        <DonutChart>
          <DonutSlice value={1} state="pending" />
          <DonutSlice value={1} state="queued" />
        </DonutChart>{' '}
        <DonutChart>
          <DonutSlice value={1} state="queued" />
        </DonutChart>
      </Block>
      <Block mb={2}>
        <ExampleHeading>
          With custom <Text mono>fill</Text> colors
        </ExampleHeading>
        <DonutChart>
          <DonutSlice value={1} fill={theme.colors.purple[0]} />
          <DonutSlice value={1} fill={theme.colors.purple[1]} />
          <DonutSlice value={1} fill={theme.colors.purple[2]} />
          <DonutSlice value={1} fill={theme.colors.purple[3]} />
          <DonutSlice value={1} fill={theme.colors.purple[4]} />
        </DonutChart>
      </Block>
    </div>
  )
}

export default DonutChartExample
