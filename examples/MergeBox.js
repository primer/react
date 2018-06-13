import React, {Fragment} from 'react'
import classnames from 'classnames'
import CircleOcticon from '../src/CircleOcticon'
import MergeStatus from '../src/MergeStatus'
import Caret from '../src/Caret'
import Box from '../src/Box'
import Text from '../src/Text'
import Block from '../src/Block'
import MergeButton from '../src/MergeButton'


// TODO: Map state to Box color, MergeStatus color

export default function MergeBox({ state }) {
  return (
    <div className='d-flex'>
      <span style={{flexGrow: 0}}><MergeStatus state={state}/></span>
      <Box ml={3} border={[true, 'green']}>
        <Caret edge='left'/>
        <Block p={2} border='bottom' style={{display: 'flex'}}>
          <Block mt={2}><CircleOcticon name='check' size={32} bg='green' color='white'/></Block>
          <Block p={2} display='inline'>
            <Text tag='p' p={0} m={0} fontSize={2} fontWeight='bold'>This branch has no conflicts with the base branch</Text>
            <Text tag='p' pt={1} m={0} fontSize={0}>Merging can be performed automatically</Text>
          </Block>
        </Block>
        <Block py={3} px={4} bg='gray-light' style={{borderBottomLeftRadius: '3px', borderBottomRightRadius: '3px'}}>
          <MergeButton scheme='primary' />
        </Block>
      </Box>
    </div>
  )
}
