import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {CounterLabel} from '../../src'

export default {
  name: 'CounterLabel',
  element: (
    <div>
      <LiveEditor code={`<CounterLabel>12</CounterLabel>`} scope={{CounterLabel}} />
      <LiveEditor code={`<CounterLabel scheme={'gray'}>13</CounterLabel>`} scope={{CounterLabel}} />
      <LiveEditor code={`<CounterLabel scheme={'gray-light'}>13</CounterLabel>`} scope={{CounterLabel}} />
    </div>
  )
}
