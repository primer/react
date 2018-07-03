import React from 'react'
import PropTypes from 'prop-types'
import {Block, ButtonLink, Link, Text} from '../../src'
import MergeButton from './MergeButton'

const MergeActions = ({numCommits, repoUrl, branchName, state}) => {
  return (
    <Block py={3} px={4} bg="gray-light" style={{borderBottomLeftRadius: '3px', borderBottomRightRadius: '3px'}}>
      <MergeButton primary={state === 'ready'} numCommits={numCommits} />
      <Text ml={2}>You can also </Text>
      <Link nounderline href={`x-github-client://openRepo/${repoUrl}?branch=${branchName}`}>
        open this in Github Desktop
      </Link>
      <Text> or view </Text>
      <ButtonLink>command line instructions.</ButtonLink>
    </Block>
  )
}

MergeActions.propTypes = {
  numCommits: PropTypes.number.isRequired,
  repoUrl: PropTypes.string.isRequired,
  branchName: PropTypes.string.isRequired
}

export default MergeActions
