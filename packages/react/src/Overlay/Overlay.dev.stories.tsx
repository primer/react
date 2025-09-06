import {useRef, useState} from 'react'
import type {Args, Meta} from '@storybook/react-vite'
import Text from '../Text'
import {Button, IconButton} from '../Button'
import Overlay from './Overlay'
import {useFocusTrap} from '../hooks/useFocusTrap'
import {XIcon} from '@primer/octicons-react'
import classes from './Overlay.dev.stories.module.css'

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
    <div ref={anchorRef}>
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
          className={classes.OverlayCustom}
          style={{padding: '16px'}}
        >
          <div className={classes.OverlayContent}>
            <IconButton
              aria-label="Close"
              onClick={closeOverlay}
              icon={XIcon}
              variant="invisible"
              className={classes.CloseButton}
            />
            <Text>Look! an overlay</Text>
          </div>
        </Overlay>
      ) : null}
    </div>
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
    <div ref={anchorRef}>
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
          <div className={classes.ResponsiveWidth}>
            <div className={classes.OverlayContent}>
              <IconButton
                aria-label="Close"
                onClick={closeOverlay}
                icon={XIcon}
                variant="invisible"
                className={classes.CloseButton}
              />
              <div className={classes.FlexColumn}>
                <Text>Are you sure?</Text>
                <div className={classes.ButtonGroup}>
                  <Button variant="danger" onClick={closeOverlay} className={classes.ButtonRight}>
                    Cancel
                  </Button>
                  <Button onClick={closeOverlay} ref={confirmButtonRef} className={classes.ButtonLeft}>
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Overlay>
      ) : null}
    </div>
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
