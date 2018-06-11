import React from 'react'
import {Block, CounterLabel} from '../src'

export default () => (
  <Block>
    <CounterLabel>12</CounterLabel>
    {' '}
    <CounterLabel theme='gray'>13</CounterLabel>
    {' '}
    <CounterLabel theme='gray-light'>13</CounterLabel>
  </Block>
)
