import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Meta, Args} from '@storybook/react'

import {BaseStyles, Box, ThemeProvider} from '..'
import Heading from '../Heading'
import {Button} from '../Button'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {registerPortalRoot} from '../Portal'

export default {
  title: 'Components/AnchoredOverlay',
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

export const Default = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
    >
      <Box width="100%" height="100%" backgroundColor="thistle" display="flex" flexDirection="column">
        <img src={`//placekitten.com/200/300`} alt="kitten" />
      </Box>
    </AnchoredOverlay>
  )
}

export const Playground = (args: Args) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)

  const onOpen = useCallback(() => setOpen(true), [])
  const onClose = useCallback(() => setOpen(false), [])

  const onAnchorClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (event.defaultPrevented || event.button !== 0) {
        return
      }
      if (!open) {
        onOpen()
      } else {
        onClose()
      }
    },
    [open, onOpen, onClose],
  )

  return (
    <>
      {args['With Anchor?'] ? (
        <AnchoredOverlay
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          width={args.width}
          height={args.height}
          renderAnchor={props => <Button {...props}>Button</Button>}
          overlayProps={args.portalContainerName}
          side={args.side}
        >
          <Box width="100%" height="100%" backgroundColor="thistle" display="flex" flexDirection="column">
            <img src={`//placekitten.com/200/300`} alt="kitten" />
          </Box>
        </AnchoredOverlay>
      ) : (
        <>
          <button ref={ref} onClick={onAnchorClick}>
            Ref button
          </button>
          <AnchoredOverlay
            open={open}
            onOpen={onOpen}
            onClose={onClose}
            width={args.width}
            height={args.height}
            renderAnchor={null}
            anchorRef={ref}
            overlayProps={args.portalContainerName}
            side={args.side}
          >
            <Box width="100%" height="100%" backgroundColor="thistle" display="flex" flexDirection="column">
              <img src={`//placekitten.com/200/300`} alt="kitten" />
            </Box>
          </AnchoredOverlay>
        </>
      )}
    </>
  )
}

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
