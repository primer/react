/* eslint-disable import/no-named-as-default-member */
import React from 'react'
import {LiveEditor} from '@compositor/kit'
import theme from '../../src/theme'
import {Block, Text, Heading} from '../../src'

const Mono = props => <Text fontFamily="mono" {...props} />

const colors = [...Object.entries(theme.colors)].reduce((keys, [key, value]) => {
  if (key !== 'bg' && key !== 'border') {
    if (Array.isArray(value)) {
      return keys.concat(Object.keys(value).map(i => `${key}.${i}`))
    } else {
      keys.push(key)
    }
  }
  return keys
}, [])

const textColors = ['white', 'gray', 'black']

const BlockExample = {
  name: 'Block',
  element: (
    <div>
      <table>
        <thead>
          <tr>
            <th className="text-left">
              <Block pb={4}>color</Block>
            </th>
            <th colSpan={textColors.length}>
              <Mono pb={4}>bg={`{color}`}</Mono>
            </th>
            <th>
              <Mono pb={4}>borderColor</Mono>
            </th>
          </tr>
        </thead>
        <tbody>
          {colors.map(color => (
            <tr key={color}>
              <td>
                <Mono mr={3}>{color}</Mono>
              </td>
              {textColors.map(fg => (
                <td key={fg}>
                  <Block p={3} mb={2} bg={color} color={fg} border={color === 'white' ? 1 : null}>
                    <Mono>{fg}</Mono>
                  </Block>
                </td>
              ))}
              <td>
                <Block p={3} mb={2} ml={3} borderColor={color} border={1}>
                  <Mono>{color}</Mono>
                </Block>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Heading fontSize="3">Code Example</Heading>
      <LiveEditor code={`<Block bg="red.0" p={3} color="red.5">Danger, Will Robinson</Block>`} scope={{Block}} />
    </div>
  )
}

export default BlockExample
