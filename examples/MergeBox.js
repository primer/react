import React, {Fragment} from 'react'
import classnames from 'classnames'
import MergeStatus from '../src/MergeStatus'
import Caret from '../src/Caret'
import Box from '../src/Box'
import Text from '../src/Text'
import Link from '../src/Link'
import Heading from '../src/Heading'
import Block from '../src/Block'
import Dropdown from '../src/Dropdown'
import Button from '../src/Button'

export default function MergeBox({ state }) {
  return (
    <div className='d-flex'>
      <span style={{flexGrow: 0}}><MergeStatus state={state}/></span>
      <Box ml={3}>
        <Caret edge='left'/>
        <Block py={2} px={4} border='bottom'>
          <Text fontSize={2} fontWeight='bold' color='red'>Review Required</Text>
          <Block pt={1}>
            <Text fontSize={0}>At least 1 approving review is required by reviewers with write access </Text>
            <Link href="#">Learn More.</Link>
          </Block>
        </Block>
        <Block py={2} px={4} border='bottom'>
          <Text fontSize={2} fontWeight='bold' color='red'>Merging is blocked</Text>
          <Block pt={1}>
            <Text fontSize={0}>Merging can be performed automatically with 1 approving review.</Text>
          </Block>
        </Block>
        <Block py={2} px={4} bg='gray-light'>
          <Block><Text fontSize={0} color='red'>As an administrator, you may still merge this pull request</Text></Block>
          <Block py={1} pr={1} >
            <Button grouped scheme='danger'>Merge Pull Request</Button>
            <Dropdown scheme='danger'/>
          </Block>
        </Block>
      </Box>
    </div>
  )
}
