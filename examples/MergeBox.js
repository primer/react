import React from 'react'
import PropTypes from 'prop-types'
import MergeStatus from '../src/MergeStatus'
import CaretBox from '../src/CaretBox'
import MergeButton from './MergeButton'
import MergeDetail from './MergeDetail'
import MergeActions from './MergeActions'

const MergeBox = ({ state, repoUrl, branchName, numCommits }) => {
  return (
    <div className='d-flex flex-items-start'>
      <MergeStatus state={state}/>
      <CaretBox ml={3} border={[true, 'green']} caret='left-top'>
        <MergeDetail/>
        <MergeActions numCommits={numCommits} repoUrl={repoUrl} branchName={branchName} />
      </CaretBox>
    </div>
  )
}

MergeBox.propTypes = {
  state: PropTypes.oneOf(['ready', 'invalid', 'merged', 'pending']).isRequired,
  repoUrl: PropTypes.string.isRequired,
  branchName: PropTypes.string.isRequired,
  numCommits: PropTypes.number.isRequired
}

export default MergeBox
