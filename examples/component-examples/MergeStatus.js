import React from 'react'
import { MergeStatus, Block } from '../../src'

const MergeStatusExample =
  {
    name: 'MergeStatus',
    element: (
      <div>
        <Block m={2}>
          <MergeStatus state='pending'/>
        </Block>
        <Block m={2}>
          <MergeStatus state='invalid'/>
        </Block>
        <Block m={2}>
          <MergeStatus state='merged'/>
        </Block>
        <Block m={2}>
          <MergeStatus state='ready'/>
        </Block>
      </div>
    )
  }

export default MergeStatusExample
