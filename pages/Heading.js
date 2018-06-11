import React from 'react'
import {Block, Heading} from '../src'
import {Detail} from '@compositor/kit'

export default () => (
  <Block>
    <Heading>Default Heading</Heading>
    <Detail>
      {[0, 1, 2, 3, 4, 5, /* 6, 7, */ '00-light', '0-light', '1-light', '2-light', '3-light'].map((fontSize, i) => (
        <Heading key={i} fontSize={fontSize} mb={2}>With fontSize={fontSize}</Heading>
      ))}
    </Detail>
  </Block>
)
