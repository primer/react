import React from 'react'
import {Text, Block} from '../../src'

const BlockExample = {
  name: 'Block',
  element: (
    <table>
      <tbody>
        {[
          // 'black',
          'white',
          'gray-dark',
          'gray',
          'gray-light',
          'blue',
          'blue-light',
          'green',
          'green-light',
          'red',
          'red-light',
          'yellow',
          'yellow-light',
          'purple',
          'purple-light'
          // 'shade-gradient'
        ].map((bg, i) => (
          <tr key={i}>
            <td>
              <Text mono nowrap>{`bg='${bg}'`}</Text>
            </td>
            {['white', 'gray', 'black'].map((fg, j) => (
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
  )
}

export default BlockExample
