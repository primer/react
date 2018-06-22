import React from 'react'
import { CounterLabel } from '../../src'

const CounterLabelExample =
  {
    name: 'CounterLabel',
    element: (
      <div>
        <CounterLabel>
          12
        </CounterLabel>
        <CounterLabel theme={'gray'}>
          13
        </CounterLabel>
        <CounterLabel theme={'gray-light'}>
          13
        </CounterLabel>
      </div>
    )
  }

export default CounterLabelExample
