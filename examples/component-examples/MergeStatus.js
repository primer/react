import React from 'react'
import {MergeStatus, Block} from '../../src'

const MergeStatusExample = {
  name: 'MergeStatus',
  element: (
    <div>
      <Block mb={2}>
        <MergeStatus state="pending" />
      </Block>
      <Block mb={2}>
        <MergeStatus state="invalid" />
      </Block>
      <Block mb={2}>
        <MergeStatus state="merged" />
      </Block>
      <Block mb={2}>
        <MergeStatus state="ready" />
      </Block>
    </div>
  )
}

export default MergeStatusExample
