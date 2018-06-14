import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import CircleOcticon from '../src/CircleOcticon'
import MergeStatus from '../src/MergeStatus'
import CaretBox from '../src/CaretBox'
import Text from '../src/Text'
import Block from '../src/Block'
import MergeButton from './src/MergeButton'
import Link from '../src/Link'
import ButtonLink from '../src/ButtonLink'


// TODO: Map state to Box color, MergeStatus color

export default function MergeBox({ state, repoUrl, branchName }) {
  return (
    <div className='d-flex flex-items-start'>
      <MergeStatus state={state}/>
      <CaretBox ml={3} border={[true, 'green']} caret='left-top'>
        <div className='p-2 d-flex border-bottom'>
          <Block mt={2}><CircleOcticon name='check' size={32} bg='green' color='white'/></Block>
          <Block p={2} display='inline'>
            <Text tag='p' p={0} m={0} fontSize={2} fontWeight='bold'>This branch has no conflicts with the base branch</Text>
            <Text tag='p' pt={1} m={0} fontSize={0}>Merging can be performed automatically</Text>
          </Block>
        </div>
        <Block py={3} px={4} bg='gray-light' style={{borderBottomLeftRadius: '3px', borderBottomRightRadius: '3px'}}>
          <MergeButton scheme='primary' numCommits={21} />
          <Text ml={2}>You can also </Text>
          <Link nounderline href={`x-github-client://openRepo/${repoUrl}?branch=${branchName}`}>open this in Github Desktop</Link>
          <Text> or view </Text>
          <ButtonLink>command line instructions.</ButtonLink>
        </Block>
      </CaretBox>
    </div>
  )
}

MergeBox.propTypes = {
  state: PropTypes.oneOf(['ready', 'invalid', 'merged', 'pending']),
  repoUrl: PropTypes.string,
  branchName: PropTypes.string,
}
