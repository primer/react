import React from 'react'
import PropTypes from 'prop-types'
import {Check} from '@githubprimer/octicons-react'
import {Box, CircleOcticon, Text} from '../../src'

const stateColorMap = {
  ready: 'green.5',
  invalid: 'invalid',
  merged: 'purple.5',
  pending: 'yellow.5'
}

const MergeDetail = ({state}) => {
  return (
    <div className="p-2 d-flex border-bottom">
      <Box mt={2}>
        <CircleOcticon icon={Check} size={32} bg={stateColorMap[state]} color="white" />
      </Box>
      <Box p={2} display="inline">
        <Text is="p" p={0} m={0} fontSize={2} fontWeight="bold">
          This branch has no conflicts with the base branch
        </Text>
        <Text is="p" pt={1} m={0} fontSize={0}>
          Merging can be performed automatically
        </Text>
      </Box>
    </div>
  )
}

MergeDetail.propTypes = {
  state: PropTypes.oneOf(Object.keys(stateColorMap)).isRequired
}

export default MergeDetail
