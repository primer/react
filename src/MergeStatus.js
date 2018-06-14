import React, {Fragment} from 'react'
import classnames from 'classnames'
import Octicon from '@github/octicons-react'
import StateLabel from './StateLabel'

const stateColorMap = {
  ready: 'green',
  invalid: 'invalid',
  merged: 'purple',
  pending: 'yellow'
}

export default function MergeStatus({ state }) {
  return (
    <StateLabel scheme={stateColorMap[state]} icon={<Octicon medium name='git-merge'/>} />
  )
}
