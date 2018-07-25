import React from 'react'
import {Library, LiveEditor} from '@compositor/kit'
import SideNav from './doc-components/SideNav'
import {Block, Box, Heading, Text, theme} from '../src'

// list components here that you want to make available in LiveEditors
const scope = {Block, Box, Heading, Text}

const {colors} = theme
// eslint-disable-next-line no-unused-vars
const {bg: bgColors, border: borderColors, ...namedColors} = colors

const Container = props => <Block p={4} maxWidth={'48em'} {...props} />

const examples = [
  {
    name: 'Color',
    element: (
      <Container>
        <LiveEditor
          code={Object.keys(namedColors)
            .reduce((list, name) => {
              const value = namedColors[name]
              if (Array.isArray(value)) {
                return list.concat(
                  `<Block mb={2}>`,
                  value.map((color, i) => `  <Text mono m={1} color='${name}.${i}'>${name}.${i}</Text>`),
                  '</Block>'
                )
              } else {
                const props = name === 'white' ? " bg='gray-dark'" : ''
                return list.concat(`<Text mono m={1} color='${name}'${props}>${name}</Text>`)
              }
            }, [])
            .join('\n')}
          scope={scope}
        />
      </Container>
    )
  },
  {
    name: 'Font size',
    element: (
      <Container>
        <LiveEditor
          code={theme.fontSizes
            .map((size, i) => {
              return `<Block><Text fontSize={${i}}>fontSize={${i}} (${size}px)</Text></Block>`
            })
            .join('\n')}
          scope={scope}
        />
      </Container>
    )
  },
  {
    name: 'Margin',
    element: (
      <Container>
        <Heading>Margin props</Heading>
        <p>
          The <Text mono>m</Text> prop sets uniform margins in the Primer spacing scale.
        </p>
        <p>
          Directional variants <Text mono>mt</Text>, <Text mono>mr</Text>,
          <Text mono>mb</Text>, and <Text mono>ml</Text> set margins on each side individually, and the{' '}
          <Text mono>mx</Text> and <Text mono>my</Text> props set horizontal and vertical margins, respectively.
        </p>
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
      </Container>
    )
  },
  {
    name: 'Padding',
    element: (
      <Container>
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
      </Container>
    )
  }
]

const PropsPage = () => {
  const basename = process.env.NODE_ENV === 'development' ? '/props' : '/primer-react/props'
  return (
    <Library
      basename={basename}
      title="Utility Props"
      examples={examples}
      renderSideNav={({title, examples}) => <SideNav title={title} examples={examples} />}
    />
  )
}

export default PropsPage
