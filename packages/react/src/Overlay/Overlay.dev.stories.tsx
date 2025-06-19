import {useRef, useState} from 'react'
import type {Args, Meta} from '@storybook/react-vite'
import Text from '../Text'
import {Button, IconButton} from '../Button'
import Overlay from './Overlay'
import {useFocusTrap} from '../hooks/useFocusTrap'
import Box from '../Box'
import {XIcon} from '@primer/octicons-react'

export default {
  title: 'Private/Components/Overlay/Dev',
  component: Overlay,
  args: {
    open: false,
  },
  argTypes: {
    open: {
      control: false,
      visible: false,
    },
  },
} as Meta<typeof Overlay>

export const SxProps = (args: Args) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const closeOverlay = () => setIsOpen(false)
  const containerRef = useRef<HTMLDivElement>(null)
  useFocusTrap({
    containerRef,
    disabled: !isOpen,
  })
  return (
    <Box ref={anchorRef}>
      <Button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        Open overlay
      </Button>
      {isOpen || args.open ? (
        <Overlay
          initialFocusRef={confirmButtonRef}
          returnFocusRef={buttonRef}
          ignoreClickRefs={[buttonRef]}
          onEscape={closeOverlay}
          onClickOutside={closeOverlay}
          width="large"
          anchorSide="inside-right"
          role="dialog"
          aria-modal="true"
          aria-label="Sample overlay"
          ref={containerRef}
          sx={{
            left: '50%',
            mt: 2,
            color: 'var(--bgColor-danger-muted)',
          }}
          style={{padding: '16px'}}
        >
          <Box
            sx={{
              height: '100vh',
              maxWidth: 'calc(-1rem + 100vw)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IconButton
              aria-label="Close"
              onClick={closeOverlay}
              icon={XIcon}
              variant="invisible"
              sx={{
                position: 'absolute',
                left: '5px',
                top: '5px',
              }}
            />
            <Text>Look! an overlay</Text>
          </Box>
        </Overlay>
      ) : null}
    </Box>
  )
}

export const PreventFocusOnOpen = (args: Args) => {
  const [isOpen, setIsOpen] = useState(false)
  const openButtonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const closeOverlay = () => setIsOpen(false)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <Box ref={anchorRef}>
      <Button
        ref={openButtonRef}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        Open overlay
      </Button>
      {isOpen || args.open ? (
        <Overlay
          initialFocusRef={confirmButtonRef}
          returnFocusRef={openButtonRef}
          ignoreClickRefs={[openButtonRef]}
          onEscape={closeOverlay}
          onClickOutside={closeOverlay}
          width={args.width}
          height={args.height}
          aria-modal={args.role === 'dialog'}
          aria-label={args.role === 'dialog' ? 'Sample overlay' : undefined}
          preventFocusOnOpen={args.preventFocusOnOpen}
          ref={containerRef}
          {...args}
        >
          <Box
            sx={{
              width: ['350px', '500px'],
            }}
          >
            <Box
              sx={{
                height: '100vh',
                maxWidth: 'calc(-1rem + 100vw)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <IconButton
                aria-label="Close"
                onClick={closeOverlay}
                icon={XIcon}
                variant="invisible"
                sx={{
                  position: 'absolute',
                  left: '5px',
                  top: '5px',
                }}
              />
              <Box display="flex" flexDirection="column" alignItems="center">
                <Text>Are you sure?</Text>
                <Box display="flex" mt={2}>
                  <Button variant="danger" onClick={closeOverlay} sx={{marginRight: 1}}>
                    Cancel
                  </Button>
                  <Button onClick={closeOverlay} ref={confirmButtonRef} sx={{marginLeft: 1}}>
                    Confirm
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Overlay>
      ) : null}
    </Box>
  )
}
PreventFocusOnOpen.args = {
  width: 'auto',
  height: 'auto',
  side: 'outside-bottom',
  preventOverflow: 'false',
  role: 'dialog',
  visibility: 'visible',
  open: false,
  preventFocusOnOpen: false,
}
PreventFocusOnOpen.argTypes = {
  width: {
    type: {
      name: 'enum',
      value: ['small', 'medium', 'large', 'xlarge', 'xxlarge', 'auto'],
    },
  },
  height: {
    type: {
      name: 'enum',
      value: ['xsmall', 'small', 'medium', 'large', 'xlarge', 'auto', 'initial'],
    },
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
  open: {
    control: false,
    visible: false,
  },
  portalContainerName: {
    control: false,
  },
  style: {
    control: false,
  },
  preventOverflow: {
    type: 'boolean',
  },
  role: {
    type: 'string',
  },
  visibility: {
    type: {
      name: 'enum',
      value: ['visible', 'hidden'],
    },
  },
  preventFocusOnOpen: {
    type: 'boolean',
  },
}
