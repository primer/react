import React from 'react'
import PropTypes from 'prop-types'
import Octicon, {GitMerge} from '@githubprimer/octicons-react'
import StateLabel from './StateLabel'
import {withSystemProps, COMMON} from './system-props'

const stateColorMap = {
  ready: 'green',
  invalid: 'invalid',
  merged: 'purple',
  pending: 'yellow'
}

const octicon = <Octicon icon={GitMerge} size="medium" />

function MergeStatus({state, ...rest}) {
  return <StateLabel {...rest} scheme={stateColorMap[state]} icon={octicon} />
}

MergeStatus.propTypes = {
  state: PropTypes.oneOf(['ready', 'invalid', 'merged', 'pending']).isRequired
}

export default withSystemProps(MergeStatus, COMMON)
