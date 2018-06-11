import React from 'react'
import {Block, Box} from '../src'

export default () => (
  <Block>
    <Box m={2}>This is a box.</Box>
    <Box p={2} m={2}>This is a box with padding.</Box>
    <Box shadow p={2} m={2}>This is a box with shadow.</Box>
    <Box shadow='medium' p={2} m={2}>This is a box with a medium shadow.</Box>
    <Box shadow='large' p={2} m={2}>This is a box with a large shadow.</Box>
    <Box shadow='extra-large' p={2} m={2}>This is a box with an extra-large shadow.</Box>
    <Box border={[true, 'green']} p={2} m={2}>This is a box with a green border.</Box>
  </Block>
)
