import React from 'react'
import PropTypes from 'prop-types'
import {Block, ButtonLink, Link, Text} from '../../src'
import MergeButton from './MergeButton'

const MergeActions = ({numCommits, onClick, desktopUrl, state}) => {
  return (
    <Block py={3} px={4} bg="gray-light" style={{borderBottomLeftRadius: '3px', borderBottomRightRadius: '3px'}}>
      <MergeButton primary={state === 'ready'} numCommits={numCommits} onClick={onClick} />
      <Text ml={2}>You can also </Text>
      <Link nounderline href={desktopUrl}>
        open this in Github Desktop
      </Link>
      <Text> or view </Text>
      <ButtonLink>command line instructions.</ButtonLink>
    </Block>
  )
}

MergeActions.propTypes = {
  desktopUrl: PropTypes.string.isRequired,
  numCommits: MergeButton.propTypes.numCommits,
  onClick: PropTypes.func.isRequired,
  state: PropTypes.string.isRequired
}

export default MergeActions
