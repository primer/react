import React, {Fragment} from 'react'
import classnames from 'classnames'
import MergeStatus from '../src/MergeStatus'
import Caret from '../src/Caret'
import Box from '../src/Box'
import Text from '../src/Text'
import Link from '../src/Link'
import Heading from '../src/Heading'
import Block from '../src/Block'
import MergeButton from '../src/MergeButton'


// TODO: Map state to Box color, MergeStatus color

export default function MergeBox({ state }) {
  return (
    <div className='d-flex'>
      <span style={{flexGrow: 0}}><MergeStatus state={state}/></span>
      <Box ml={3} border={[true, 'green']}>
        <Caret edge='left'/>
        <Block py={2} px={4} border='bottom'>
          <Text tag='p' m={1} fontSize={2} fontWeight='bold'>This branch has no conflicts with the base branch</Text>
          <Text tag='p' m={1} mt={0} fontSize={0}>Merging can be performed automatically</Text>
        </Block>
        <Block py={2} px={4} bg='gray-light'>
          <Block py={1} pr={1} >
            <MergeButton scheme='primary' />
          </Block>
        </Block>
      </Box>
    </div>
  )
}
