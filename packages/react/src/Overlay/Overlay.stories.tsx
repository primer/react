import {useState, useRef, type ComponentProps} from 'react'
import type {Args, Meta} from '@storybook/react-vite'
import {XIcon} from '@primer/octicons-react'
import {Button, Text, useFocusTrap, IconButton} from '..'
import Overlay from '../Overlay'
import classes from './Overlay.stories.module.css'

export default {
  title: 'Private/Components/Overlay',
  component: Overlay,
  argTypes: {
    anchorSide: {
      description:
        'If provided, the Overlay will slide into position from the side of the anchor with a brief animation',
      type: 'string',
      table: {
        type: {
          summary:
            "'inside-top' | 'inside-bottom' | 'inside-left' | 'inside-right' | 'inside-center' | 'outside-top' | 'outside-bottom' | 'outside-left' | 'outside-right'",
        },
      },
    },
    bottom: {
      description:
        'Optional. Vertical bottom position of the overlay, relative to its closest positioned ancestor (often its `Portal`).',
      type: 'string',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    ignoreClickRefs: {
      description:
        'An array of ref objects to ignore clicks on in the onOutsideClick behavior. This is often used to ignore clicking on the element that toggles the open/closed state for the Overlay to prevent the Overlay from being toggled twice.',
      type: 'symbol',
      table: {
        type: {
          summary: 'React.RefObject<HTMLElement>[]',
        },
      },
    },
    initialFocusRef: {
      description:
        'Optional. Ref for the element to focus when the `Overlay` is opened. If nothing is provided, the first focusable element in the `Overlay` body is focused.',
      type: 'symbol',
      table: {
        type: {
          summary: 'React.RefObject<HTMLElement>',
        },
      },
    },
    height: {
      description:
        'Sets the height of the `Overlay`, pick from our set list of heights, or pass `auto` to automatically set the height based on the content of the `Overlay`, or pass `initial` to set the height based on the initial content of the `Overlay` (i.e. ignoring content changes). `xsmall` corresponds to `192px`, `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `432px`, `xlarge` corresponds to `600px`.',
      type: 'string',
      table: {
        type: {
          summary: "'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'auto'",
        },
      },
    },
    left: {
      description:
        'Optional. Horizontal left position of the overlay, relative to its closest positioned ancestor (often its `Portal`).',
      type: 'string',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    maxHeight: {
      description:
        'Sets the maximum height of the `Overlay`, pick from our set list of heights. `xsmall` corresponds to `192px`, `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `432px`, `xlarge` corresponds to `600px`.',
      type: 'string',
      table: {
        type: {
          summary: "'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'",
        },
      },
    },
    maxWidth: {
      description:
        'Sets the maximum height of the `Overlay`, pick from our set list of heights. `xsmall` corresponds to `192px`, `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `432px`, `xlarge` corresponds to `600px`.',
      type: 'string',
      table: {
        type: {
          summary: "'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'",
        },
      },
    },
    onClickOutside: {
      description:
        'Function to call when clicking outside of the `Overlay`. Typically this function sets the `Overlay` visibility state to `false`',
      type: 'function',
      table: {
        type: {
          summary: 'function',
        },
      },
    },
    onEscape: {
      description:
        'Function to call when user presses `Escape`. Typically this function sets the `Overlay` visibility state to `false`.',
      type: 'function',
      table: {
        type: {
          summary: 'function',
        },
      },
    },
    overflow: {
      description: '',
      type: 'string',
      table: {
        type: {
          summary: "'auto' | 'hidden' | 'scroll' | 'visible'",
        },
      },
    },
    portalContainerName: {
      description: 'If defined, Overlays will be rendered in the named portal.',
      type: 'string',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    position: {
      description: 'Optional. Sets how an element is positioned in a document. Defaults to `absolute` positioning.',
      type: 'string',
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: 'absolute',
        },
      },
    },
    preventOverflow: {
      description:
        'Optional. The Overlay width will be adjusted responsively if there is not enough space to display the Overlay. If `preventOverflow` is `true`, the width of the `Overlay` will not be adjusted.',
      type: 'boolean',
      table: {
        type: {
          summary: 'boolean',
        },
      },
    },
    returnFocusRef: {
      description: 'Ref for the element to focus when the `Overlay` is closed.',
      type: 'symbol',
      table: {
        type: {
          summary: 'React.RefObject<HTMLElement>',
        },
      },
    },
    right: {
      description:
        'Optional. Horizontal right position of the overlay, relative to its closest positioned ancestor (often its `Portal`).',
      type: 'string',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    role: {
      description: 'The ARIA role to assign to the overlay.',
      type: 'string',
      table: {
        type: {
          summary: 'AriaRole',
        },
      },
    },
    top: {
      description:
        'Optional. Vertical top position of the overlay, relative to its closest positioned ancestor (often its `Portal`).',
      type: 'string',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    visibility: {
      description: 'Sets the visibility of the `Overlay`.',
      type: 'string',
      table: {
        type: {
          summary: "'visible' | 'hidden'",
        },
      },
    },
    width: {
      description:
        'Sets the width of the `Overlay`, pick from our set list of widths, or pass `auto` to automatically set the width based on the content of the `Overlay`. `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `480px`, `xlarge` corresponds to `640px`, `xxlarge` corresponds to `960px`.',
      type: 'string',
      table: {
        type: {
          summary: "'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'auto'",
        },
      },
    },
    style: {
      table: {
        disable: true,
      },
    },
  },
} as Meta<ComponentProps<typeof Overlay>>

export const Default = (args: Args) => {
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
        >
          <div className={classes.FullHeightContent}>
            <IconButton
              aria-label="Close"
              onClick={closeOverlay}
              icon={XIcon}
              variant="invisible"
              className={classes.CloseButtonOverlay}
            />
            <Text>Look! an overlay</Text>
          </div>
        </Overlay>
      ) : null}
    </div>
  )
}
Default.args = {
  open: false,
}
Default.argTypes = {
  open: {
    control: false,
    visible: false,
  },
}
export const Playground = (args: Args) => {
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
          width={args.width}
          height={args.height}
          aria-modal={args.role === 'dialog'}
          aria-label={args.role === 'dialog' ? 'Sample overlay' : undefined}
          ref={containerRef}
          {...args}
        >
          <div className={classes.ResponsiveWidth}>
            <div className={classes.FullHeightContent}>
              <IconButton
                aria-label="Close"
                onClick={closeOverlay}
                icon={XIcon}
                variant="invisible"
                className={classes.CloseButtonOverlay}
              />
              <Text>Look! an overlay</Text>
            </div>
          </div>
        </Overlay>
      ) : null}
    </div>
  )
}
Playground.args = {
  width: 'auto',
  height: 'auto',
  side: 'outside-bottom',
  preventOverflow: 'false',
  role: 'dialog',
  visibility: 'visible',
  open: false,
}
Playground.argTypes = {
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
}
