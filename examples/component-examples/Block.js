import React from 'react'
import {colors} from  '../../src/theme'
import {Block, Text} from  '../../src'

const backgroundColors = Object.keys(colors.bg)
  .filter(color => color !== 'orange')

const textColors = ['white', 'gray', 'black']

const BlockExample = {
  name: 'Block',
  element: (
    <Block p={4}>
      <table>
        <tbody>
          {backgroundColors.map((bg, i) => (
            <tr key={i}>
              <td>
                <Text mono nowrap>{`bg='${bg}'`}</Text>
              </td>
              {textColors.map((fg, j) => (
                <td key={j}>
                  <Block p={3} mb={2} bg={bg} border={bg === 'white'}>
                    <Text color={fg}>{fg}</Text>
                  </Block>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Block>
  )
}

export default BlockExample
