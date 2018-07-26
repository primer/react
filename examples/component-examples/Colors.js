import React from 'react'
import {Block, FlexContainer, theme} from '../../src'

const ColorsExample = {
  name: 'Colors',
  element: (
    <div>
      {['gray', 'blue', 'green', 'purple', 'yellow', 'orange'].map(hue => (
        <FlexContainer key={hue}>
          {theme.colors[hue].map((colorValue, i) => {
            const colorKey = `${hue}.${i}`
            return (
              <Block>
                <Block bg={colorKey} m={1} mt={3} p={6} />
                <Heading tag="h3" fontSize={2} px={1}>
                  {colorKey}
                </Heading>
                <Text px={1} mono>{colorValue}</Text>
              </Block>
            )
          })}
        </FlexContainer>
      ))}
      <div className="d-flex">
        <Block bg="blue.5" p={4} m={1} />
        <Block bg="green.5" p={4} m={1} />
        <Block bg="purple.5" p={4} m={1} />
        <Block bg="yellow.5" p={4} m={1} />
        <Block bg="red.5" p={4} m={1} />
        <Block bg="white" p={4} m={1} border />
        <Block bg="gray.5" p={4} m={1} />
        <Block bg="gray.5" p={4} m={1} />
        <Block bg="blue.2" p={4} m={1} />
        <Block bg="purple.2" p={4} m={1} />
        <Block bg="red.2" p={4} m={1} />
      </div>
    </div>
  )
}

export default ColorsExample
