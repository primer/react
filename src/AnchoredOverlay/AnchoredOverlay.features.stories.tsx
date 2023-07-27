import React, {useEffect, useRef} from 'react'
import {Args, Meta} from '@storybook/react'

import {BaseStyles, Box, ThemeProvider} from '..'
import {AnchoredOverlay} from '../AnchoredOverlay'
import Heading from '../Heading'
import {registerPortalRoot} from '../Portal'
import {Playground} from './AnchoredOverlay.stories'

export default {
  title: 'Components/AnchoredOverlay/Features',
  component: AnchoredOverlay,
  args: {
    'With Anchor?': true,
    width: 'small',
    height: 'auto',
    portalContainerName: 'Portal name',
    side: 'outside-bottom',
  },
  argTypes: {
    'With Anchor?': {
      type: 'boolean',
    },
    width: {
      type: {
        name: 'enum',
        value: ['small', 'medium', 'large', 'xlarge', 'xxlarge', 'auto'],
      },
      portalContainerName: {type: 'string'},
    },
    height: {
      type: {
        name: 'enum',
        value: ['xsmall', 'small', 'medium', 'large', 'xlarge', 'auto', 'initial'],
      },
      portalContainerName: {type: 'string'},
    },
    side: {
      type: {
        name: 'enum',
        value: [
          'inside-top',
          'inside-bottom',
          'inside-left',
          'inside-right',
          'inside-center',
          'outside-top',
          'outside-bottom',
          'outside-left',
          'outside-right',
        ],
      },
    },
  },
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    },
  ],
} as Meta

const HeaderAndLayout = ({children}: {children: JSX.Element}) => {
  const scrollingElementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scrollingElementRef.current) {
      registerPortalRoot(scrollingElementRef.current, 'scrollingPortal')
    }
  }, [scrollingElementRef])
  return (
    <Box position="absolute" top={0} right={0} bottom={0} left={0} padding={4} backgroundColor="lavenderblush">
      <Heading>Header or some such</Heading>
      <Box position="absolute" top={10} right={4} bottom={4} left={4} overflow="scroll" backgroundColor="powderblue">
        {children}
        <Box ref={scrollingElementRef} position="absolute" top={0} left={0} />
      </Box>
    </Box>
  )
}

export const PortalInsideScrollingElement = (args: Args) => {
  const rows = 20
  const columns = 10
  return (
    <HeaderAndLayout>
      <table>
        <tbody>
          {Array(rows)
            .fill(null)
            .map((_, i) => (
              <tr key={i}>
                {Array(columns)
                  .fill(null)
                  .map((_1, j) => (
                    <td key={`${i}${j}`}>
                      <Box m={2}>
                        <Playground {...{...args, portalContainerName: 'scrollingPortal'}} />
                      </Box>
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </HeaderAndLayout>
  )
}
