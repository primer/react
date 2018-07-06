/* eslint-disable import/no-named-as-default-member */
import React from 'react'
import theme from '../../src/theme'
import {Block, Text} from '../../src'

const colors = Object.keys(theme.colors.bg)
const textColors = ['white', 'gray', 'black']

const BlockExample = {
  name: 'Block',
  element: (
    <Block p={4}>
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
                  <Block p={3} mb={2} bg={color} fg={fg} border={color === 'white'}>
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
    </Block>
  )
}

export default BlockExample
