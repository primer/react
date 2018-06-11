import React from 'react'
import {Block, Text, theme} from '../src'

export default () => (
  <Block>
    {[/* 7, 6, */ 5, 4, 3, 2, 1, 0].map((fontSize, i) => (
      <Text tag='div' key={i} fontSize={fontSize}>fontSize {fontSize}</Text>
    ))}
  </Block>
)
