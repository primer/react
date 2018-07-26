/* eslint-disable import/no-named-as-default-member */
import React from 'react'
import {LiveEditor} from '@compositor/kit'
import theme from '../../src/theme'
import {colorNames} from '../../src/mappers'
import {Block, Text, Heading} from '../../src'

const textColors = ['white', 'gray.5', 'black']

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
          {colorNames.map(color => (
            <tr key={color}>
              <td>
                <Text mono nowrap mr={3}>
                  {color}
                </Text>
              </td>
              {textColors.map(fg => (
                <td key={fg}>
                  <Block p={3} mb={2} bg={color} color={fg} border={color === 'white'}>
                    <Text mono>{fg}</Text>
                  </Block>
                </td>
              ))}
              <td>
                <Block p={3} mb={2} ml={3} borderColor={color}>
                  <Text mono>{color}</Text>
                </Block>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Heading fontSize="3">Code Example</Heading>
      <LiveEditor
        code={`<Block width="400" display="inline-block" bg="blue.5" p={3} color="white">white</Block>`}
        scope={{Block}}
      />
    </div>
  )
}

export default BlockExample
