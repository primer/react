import React from 'react'
import CircleOcticon from '../src/CircleOcticon'
import Text from '../src/Text'
import Block from '../src/Block'
import Link from '../src/Link'
import ButtonLink from '../src/ButtonLink'
import MergeButton from './MergeButton'

const MergeActions = ({ numCommits, repoUrl, branchName }) => {
  return (
    <Block py={3} px={4} bg='gray-light' style={{borderBottomLeftRadius: '3px', borderBottomRightRadius: '3px'}}>
      <MergeButton scheme='primary' numCommits={numCommits} />
      <Text ml={2}>You can also </Text>
      <Link nounderline href={`x-github-client://openRepo/${repoUrl}?branch=${branchName}`}>open this in Github Desktop</Link>
      <Text> or view </Text>
      <ButtonLink>command line instructions.</ButtonLink>
    </Block>
  )
}

MergeActions.propTypes = {
  numCommits: PropTypes.number.isRequired,
  repoUrl: PropTypes.string.isRequired,
  branchName: PropTypes.string.isRequired,
}

export default MergeActions
