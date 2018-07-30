/* eslint-disable import/no-named-as-default-member */
import React from 'react'
import {LiveEditor} from '@compositor/kit'
import theme from '../../src/theme'
import {Block, Text, Heading} from '../../src'

const colors = [...Object.entries(theme.colors)].reduce((keys, [key, value]) => {
  if (key !== 'bg' && key !== 'border') {
    if (Array.isArray(value)) {
      return keys.concat(
        Object.keys(value).map(i => `${key}.${i}`)
      )
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
              <Text tag="div" pb={4} mono>
                color
              </Text>
            </th>
            <th colSpan={textColors.length}>
              <Text tag="div" pb={4} mono>
                bg={`{color}`}
              </Text>
            </th>
            <th>
              <Text tag="div" pb={4} mono>
                borderColor
              </Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {colors.map(color => (
            <tr key={color}>
              <td>
                <Text mono nowrap mr={3}>
                  {color}
                </Text>
              </td>
              {textColors.map(fg => (
                <td key={fg}>
                  <Block p={3} mb={2} bg={color} color={fg} border={color === 'white' ? 1 : null}>
                    <Text mono>{fg}</Text>
                  </Block>
                </td>
              ))}
              <td>
                {color in theme.colors.border ? (
                  <Block p={3} mb={2} ml={3} borderColor={color}>
                    <Text mono>{color}</Text>
                  </Block>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Heading fontSize="3">Code Example</Heading>
      <LiveEditor
        code={`<Block bg="red.0" p={3} color="red.5">Danger, Will Robinson</Block>`}
        scope={{Block}}
      />
    </div>
  )
}

export default BlockExample
