import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {MergeStatus, Block} from '../../src'

const MergeStatusExample = {
  name: 'MergeStatus',
  element: (
    <div>
      <Block mb={2}>
        <LiveEditor code={`<MergeStatus state="pending" />`} scope={{MergeStatus}}/>
      </Block>
      <Block mb={2}>
        <LiveEditor code={`<MergeStatus state="invalid" />`} scope={{MergeStatus}}/>
      </Block>
      <Block mb={2}>
        <LiveEditor code={`<MergeStatus state="merged" />`} scope={{MergeStatus}}/>
      </Block>
      <Block mb={2}>
        <LiveEditor code={`<MergeStatus state="ready" />`} scope={{MergeStatus}}/>
      </Block>
    </div>
  )
}

export default MergeStatusExample
