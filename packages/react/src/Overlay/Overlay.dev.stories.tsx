import React, {useRef, useState} from 'react'
import type {Args, Meta} from '@storybook/react'
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
