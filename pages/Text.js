import React from 'react'
import {Block, Text} from '../src'

export default () => (
  <Block>
    <Text tag='div'>Text</Text>
    <Text tag='div' fontWeight='bold'>Text bold</Text>
    <Text tag='div' color='green'>Text green</Text>
    <Text tag='div' lineHeight='condensed'>Text lineHeight 'condensed'</Text>
    <Text tag='div' fontSize={4}>Text fontSize 4</Text>
    <Text tag='div' p={4}>Text padding 4</Text>
  </Block>
)
