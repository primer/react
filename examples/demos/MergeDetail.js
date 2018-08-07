import React from 'react'
import PropTypes from 'prop-types'
import {Check} from '@githubprimer/octicons-react'
import {Block, CircleOcticon, Text} from '../../src'

const stateColorMap = {
  ready: 'green.5',
  invalid: 'invalid',
  merged: 'purple.5',
  pending: 'yellow.5'
}

const MergeDetail = ({state}) => {
  return (
    <div className="p-2 d-flex border-bottom">
      <Block mt={2}>
        <CircleOcticon icon={Check} size={32} bg={stateColorMap[state]} color="white" />
      </Block>
      <Block p={2} display="inline">
        <Text is="p" p={0} m={0} fontSize={2} fontWeight="bold">
          This branch has no conflicts with the base branch
        </Text>
        <Text is="p" pt={1} m={0} fontSize={0}>
          Merging can be performed automatically
        </Text>
      </Block>
    </div>
  )
}

MergeDetail.propTypes = {
  state: PropTypes.oneOf(Object.keys(stateColorMap)).isRequired
}

export default MergeDetail
