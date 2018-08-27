import React from 'react'
import PropTypes from 'prop-types'
import {Check} from '@githubprimer/octicons-react'
import {Box, CircleOcticon, FlexContainer, Text} from '../../src'

const stateColorMap = {
  ready: 'green.5',
  invalid: 'invalid',
  merged: 'purple.5',
  pending: 'yellow.5'
}

const MergeDetail = ({state, ...rest}) => {
  return (
    <FlexContainer p={2} {...rest}>
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
    </FlexContainer>
  )
}

MergeDetail.propTypes = {
  ...FlexContainer.propTypes,
  state: PropTypes.oneOf(Object.keys(stateColorMap)).isRequired
}

export default MergeDetail
