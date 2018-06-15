import React from 'react'
import CircleOcticon from '../src/CircleOcticon'
import Text from '../src/Text'
import Block from '../src/Block'

const MergeDetail = () => {
  return (
    <div className='p-2 d-flex border-bottom'>
      <Block mt={2}>
        <CircleOcticon name='check' size={32} bg='green' color='white'/>
      </Block>
      <Block p={2} display='inline'>
        <Text tag='p' p={0} m={0} fontSize={2} fontWeight='bold'>This branch has no conflicts with the base branch</Text>
        <Text tag='p' pt={1} m={0} fontSize={0}>Merging can be performed automatically</Text>
      </Block>
    </div>
  )
}

export default MergeDetail
