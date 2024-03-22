import React, {useEffect, useRef} from 'react'
import type {Args, Meta} from '@storybook/react'

import {Box} from '..'
import {AnchoredOverlay} from '../AnchoredOverlay'
import Heading from '../Heading'
import {registerPortalRoot} from '../Portal'
import {Playground} from './AnchoredOverlay.stories'

export default {
  title: 'Components/AnchoredOverlay/Features',
  component: AnchoredOverlay,
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
