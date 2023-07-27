import React, {useCallback, useRef, useState} from 'react'
import {Args, Meta} from '@storybook/react'

import {BaseStyles, Box, ThemeProvider} from '..'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {Button} from '../Button'

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
