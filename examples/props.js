import React from 'react'
import {Library, LiveEditor} from '@compositor/kit'
import SideNav from './doc-components/SideNav'
import {Block, Box, Text, theme} from '../src'

// list components here that you want to make available in LiveEditors
const scope = {Block, Box, Text}

const {colors} = theme
const {bg: bgColors, border: borderColors, ...namedColors} = colors

const examples = [
  {
    name: 'Margin',
    element: (
      <Block p={4}>
        <LiveEditor
          code={`
<Box m={0}>No margin</Box>
<Box m={1}>Uniform margin x1</Box>
<Box m={2}>Uniform margin x2</Box>
<Box m={3}>Uniform margin x3</Box>
<Box m={4}>Uniform margin x4</Box>
`.trim()}
          scope={scope}
        />
      </Block>
    )
  },
  {
    name: 'Padding',
    element: (
      <Block p={4}>
        <LiveEditor
          code={`
<Box p={0}>No padding</Box>
<Box p={1}>Uniform padding x1</Box>
<Box p={2}>Uniform padding x2</Box>
<Box p={3}>Uniform padding x3</Box>
<Box p={4}>Uniform padding x4</Box>
`.trim()}
          scope={scope}
        />
      </Block>
    )
  },
  {
    name: 'Color',
    element: (
      <Block p={4}>
        <LiveEditor
          code={
            Object.keys(namedColors).reduce((list, name) => {
              const value = namedColors[name]
              if (Array.isArray(value)) {
                return list.concat(
                  `<Block mb={2}>`,
                  value.map((color, i) => `  <Text mono m={1} color='${name}.${i}'>${name}.${i}</Text>`),
                  '</Block>'
                )
              } else {
                return list.concat(`<Text mono m={1} color='${name}'${name === 'white' ? " bg='gray-dark'" : ''}>${name}</Text>`)
              }
            }, []).join('\n')
          }
          scope={scope}
        />
      </Block>
    )
  },
  {
    name: 'Font size',
    element: (
      <Block p={4}>
        <LiveEditor
          code={
            theme.fontSizes.map((size, i) => {
              return `<Block><Text fontSize={${i}}>fontSize={${i}} (${size}px)</Text></Block>`
            }).join('\n')
          }
          scope={scope}
        />
      </Block>
    )
  },

]

const PropsPage = () => {
  const basename = process.env.NODE_ENV === 'development' ? '/props' : '/primer-react/props'
  return (
    <Library
      basename={basename}
      title="Props"
      examples={examples}
      renderSideNav={({title, examples}) => <SideNav title={title} examples={examples} />}
    />
  )
}

export default PropsPage
