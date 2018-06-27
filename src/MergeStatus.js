import React from 'react'
import PropTypes from 'prop-types'
import Octicon from '@github/octicons-react'
import StateLabel from './StateLabel'

const stateColorMap = {
  ready: 'green',
  invalid: 'invalid',
  merged: 'purple',
  pending: 'yellow'
}

const MergeStatus = ({state}) => <StateLabel scheme={stateColorMap[state]} icon={<Octicon medium name="git-merge" />} />

MergeStatus.propTypes = {
  state: PropTypes.oneOf(['ready', 'invalid', 'merged', 'pending']).isRequired
}

export default MergeStatus
