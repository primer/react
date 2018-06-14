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

const MergeStatus = ({ state }) => <StateLabel scheme={stateColorMap[state]} icon={<Octicon medium name='git-merge'/>} />


MergeStatus.propTypes = {
  state: PropTypes.oneOf(['ready', 'invalid', 'merged', 'pending'])
}

export default MergeStatus
