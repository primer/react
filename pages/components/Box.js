/* eslint-disable import/no-named-as-default-member */
import React from 'react'
import {LiveEditor} from '@compositor/kit'
import theme from '../../src/theme'
import {Box, Text, Heading} from '../../src'

export const meta = {displayName: 'Box'}

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

const textColors = ['white', 'gray.5', 'black']

export default function BoxExample() {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th className="text-left">
              <Box pb={4}>color</Box>
            </th>
            <th colSpan={textColors.length}>
              <Mono pb={4}>
                bg=
                {`{color}`}
              </Mono>
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
                  <Box p={3} mb={2} bg={color} color={fg} border={color === 'white' ? 1 : null}>
                    <Mono>{fg}</Mono>
                  </Box>
                </td>
              ))}
              <td>
                <Box p={3} mb={2} ml={3} borderColor={color} border={1}>
                  <Mono>{color}</Mono>
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
